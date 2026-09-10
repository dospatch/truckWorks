const {
    ChannelType,
    PermissionFlagsBits
} = require("discord.js");

const {
    createTicketPanel
} = require("./ticketPanel");

const ticketConfig =
    require("../config/tickets");

function normalize(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
}

function findCategory(guild, name) {
    const wanted = normalize(name);

    return guild.channels.cache.find(channel => {
        return (
            channel.type === ChannelType.GuildCategory &&
            normalize(channel.name) === wanted
        );
    });
}

async function findOrCreateCategory(guild, name) {
    let category = findCategory(guild, name);

    if (category) {
        return {
            category,
            created: false
        };
    }

    category = await guild.channels.create({
        name,
        type: ChannelType.GuildCategory
    });

    return {
        category,
        created: true
    };
}

function findRole(guild, name) {
    const wanted = normalize(name);

    return guild.roles.cache.find(role => {
        const current = normalize(role.name);

        return (
            current === wanted ||
            current.endsWith(wanted) ||
            wanted.endsWith(current)
        );
    });
}

async function repairCategoryPermissions(guild, category) {
    if (!category) {
        return false;
    }

    const botMember = guild.members.me;

    if (!botMember) {
        return false;
    }

    const botRole = botMember.roles.highest;

    try {
        await category.permissionOverwrites.edit(
            botRole.id,
            {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true,
                EmbedLinks: true,
                ManageChannels: true,
                ManageMessages: true
            }
        );

        return true;
    } catch (error) {
        console.error(
            `❌ Could not repair permissions for ${category.name}:`,
            error
        );

        return false;
    }
}

async function setupTicketSystem(guild) {
    if (!guild) {
        throw new Error("Guild was not provided.");
    }

    const botMember = guild.members.me;

    if (!botMember) {
        throw new Error(
            "Could not resolve the TruckWorks bot member."
        );
    }

    const requiredPermissions = [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.EmbedLinks,
        PermissionFlagsBits.ManageChannels
    ];

    const missingPermissions =
        requiredPermissions.filter(
            permission =>
                !botMember.permissions.has(permission)
        );

    const categoryNames = [
        "SUPPORT",
        "SERVER NETWORK",
        "VTC CENTER",
        "CREATORS"
    ];

    const categories = {};
    const createdCategories = [];

    for (const name of categoryNames) {
        const result =
            await findOrCreateCategory(
                guild,
                name
            );

        categories[name] = result.category;

        if (result.created) {
            createdCategories.push(name);
        }
    }

    /*
     * Manage Channels is a SERVER-LEVEL permission.
     * Discord will not allow the bot to create ticket
     * channels if this permission is missing.
     */
    if (
        missingPermissions.includes(
            PermissionFlagsBits.ManageChannels
        )
    ) {
        return {
            success: false,
            reason: "MISSING_MANAGE_CHANNELS",
            missingPermissions,
            createdCategories,
            categories,
            panelChannel: null
        };
    }

    for (const category of Object.values(categories)) {
        await repairCategoryPermissions(
            guild,
            category
        );
    }

    const panelNames =
        ticketConfig.settings
            .panelChannelNames || [
                "create-ticket",
                "create-tickets",
                "ticket",
                "tickets"
            ];

    let panelChannel =
        guild.channels.cache.find(channel => {
            if (
                channel.type !==
                ChannelType.GuildText
            ) {
                return false;
            }

            const channelName =
                normalize(channel.name);

            return panelNames.some(
                name =>
                    channelName ===
                    normalize(name)
            );
        });

    if (!panelChannel) {
        panelChannel =
            await guild.channels.create({
                name: "create-ticket",
                type: ChannelType.GuildText,
                parent: categories.SUPPORT.id
            });
    }

    try {
        await panelChannel.permissionOverwrites.edit(
            botMember.roles.highest.id,
            {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true,
                EmbedLinks: true,
                ManageChannels: true,
                ManageMessages: true
            }
        );
    } catch (error) {
        console.error(
            "❌ Could not repair panel permissions:",
            error
        );
    }

    const existingMessages =
        await panelChannel.messages
            .fetch({
                limit: 20
            })
            .catch(error => {
                console.error(
                    "❌ Could not read ticket panel messages:",
                    error
                );

                return null;
            });

    const hasPanel =
        existingMessages &&
        existingMessages.some(message =>
            message.author.id ===
                guild.client.user.id &&
            message.components.some(row =>
                row.components.some(
                    component =>
                        component.customId ===
                        "ticket_create"
                )
            )
        );

    if (!hasPanel) {
        await panelChannel.send(
            createTicketPanel()
        );
    }

    return {
        success: true,
        createdCategories,
        categories,
        panelChannel,
        missingPermissions: []
    };
}

module.exports = {
    setupTicketSystem,
    findOrCreateCategory,
    repairCategoryPermissions
};
