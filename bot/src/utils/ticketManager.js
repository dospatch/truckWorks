const {
    ChannelType,
    PermissionFlagsBits
} = require("discord.js");

const config = require("../config/tickets");

function normalize(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
}

function findCategory(guild, categoryName) {
    const wanted = normalize(categoryName);

    return guild.channels.cache.find(channel => {
        if (channel.type !== ChannelType.GuildCategory) {
            return false;
        }

        const current = normalize(channel.name);

        return (
            current === wanted ||
            current.endsWith(wanted) ||
            wanted.endsWith(current)
        );
    });
}

function findStaffRole(guild, roleName) {
    const wanted = normalize(roleName);

    return guild.roles.cache.find(role => {
        const current = normalize(role.name);

        return (
            current === wanted ||
            current.endsWith(wanted) ||
            wanted.endsWith(current)
        );
    });
}

function encodeTopicValue(value) {
    return encodeURIComponent(String(value || ""))
        .replace(/%/g, "~");
}

function decodeTopicValue(value) {
    try {
        return decodeURIComponent(
            String(value || "").replace(/~/g, "%")
        );
    } catch {
        return value;
    }
}

function getTicketInfo(channel) {
    if (!channel?.topic) {
        return null;
    }

    const type =
        channel.topic.match(/ticketType:([^\s]+)/);

    const owner =
        channel.topic.match(/ticketOwner:([^\s]+)/);

    const number =
        channel.topic.match(/ticketNumber:([^\s]+)/);

    const status =
        channel.topic.match(/ticketStatus:([^\s]+)/);

    const claimed =
        channel.topic.match(/ticketClaimedBy:([^\s]+)/);

    const closedBy =
        channel.topic.match(/ticketClosedBy:([^\s]+)/);

    const closeReason =
        channel.topic.match(/ticketCloseReason:([^\s]+)/);

    if (!type || !owner || !number) {
        return null;
    }

    return {
        type: type[1],
        ownerId: owner[1],
        ticketNumber: number[1],
        status: status ? status[1] : "open",
        claimedBy:
            claimed && claimed[1] !== "none"
                ? claimed[1]
                : null,
        closedBy:
            closedBy && closedBy[1] !== "none"
                ? closedBy[1]
                : null,
        closeReason:
            closeReason && closeReason[1] !== "none"
                ? decodeTopicValue(closeReason[1])
                : null
    };
}

async function resolveTicketChannel(channel) {
    if (!channel?.id) {
        return null;
    }

    try {
        // Prefer the live Discord channel instead of relying
        // on a potentially stale cached channel object.
        const freshChannel =
            await channel.guild.channels.fetch(channel.id);

        if (!freshChannel) {
            return null;
        }

        return freshChannel;

    } catch (error) {
        if (error?.code === 10003) {
            console.warn(
                `⚠️ Ticket channel ${channel.id} no longer exists.`
            );

            return null;
        }

        console.error(
            "❌ Failed to resolve ticket channel:",
            error
        );

        return null;
    }
}

async function updateTicketTopic(channel, info) {
    const freshChannel =
        await resolveTicketChannel(channel);

    if (!freshChannel) {
        throw new Error(
            "TICKET_CHANNEL_NOT_FOUND"
        );
    }

    await freshChannel.setTopic(
        `ticketType:${info.type} ` +
        `ticketOwner:${info.ownerId} ` +
        `ticketNumber:${info.ticketNumber} ` +
        `ticketStatus:${info.status} ` +
        `ticketClaimedBy:${info.claimedBy || "none"} ` +
        `ticketClosedBy:${info.closedBy || "none"} ` +
        `ticketCloseReason:${info.closeReason ? encodeTopicValue(info.closeReason) : "none"}`
    );

    return freshChannel;
}


function getNextTicketNumber(guild) {
    let highest = 0;

    for (const channel of guild.channels.cache.values()) {
        const match =
            channel.name.match(
                /(?:ticket|closed)-(\d+)/i
            );

        if (match) {
            highest = Math.max(
                highest,
                Number(match[1])
            );
        }
    }

    return String(highest + 1)
        .padStart(4, "0");
}

async function getUserOpenTickets(guild, userId) {
    /*
     * Fetch the current channel list from Discord.
     */
    let channels;

    try {
        channels =
            await guild.channels.fetch();
    } catch (error) {
        console.error(
            "❌ Failed to fetch guild channels while checking tickets:",
            error
        );

        return [];
    }

    const openTickets = [];

    /*
     * Only channels whose configured parent category matches
     * one of the TruckWorks ticket categories are allowed to
     * count as active tickets.
     */
    const validCategoryIds = new Set();

    for (const ticketType of Object.values(config.ticketTypes)) {
        const category =
            channels.find(channel => {
                if (
                    !channel ||
                    channel.type !== ChannelType.GuildCategory
                ) {
                    return false;
                }

                const current =
                    normalize(channel.name);

                const wanted =
                    normalize(ticketType.category);

                return (
                    current === wanted ||
                    current.endsWith(wanted) ||
                    wanted.endsWith(current)
                );
            });

        if (category) {
            validCategoryIds.add(category.id);
        }
    }

    for (const channel of channels.values()) {
        if (!channel) {
            continue;
        }

        /*
         * Only normal text channels can be TruckWorks tickets.
         */
        if (
            channel.type !== ChannelType.GuildText
        ) {
            continue;
        }

        /*
         * Ignore anything outside the configured ticket
         * categories.
         */
        if (
            !channel.parentId ||
            !validCategoryIds.has(channel.parentId)
        ) {
            continue;
        }

        /*
         * Verify the channel actually looks like a ticket.
         */
        const info =
            getTicketInfo(channel);

        if (!info) {
            continue;
        }

        /*
         * Only this user's active ticket counts.
         */
        if (
            info.ownerId === userId &&
            info.status !== "closed"
        ) {
            openTickets.push(channel);
        }
    }

    console.log(
        `🎫 Active ticket check for ${userId}: ${openTickets.length} ticket(s) found.`
    );

    if (openTickets.length > 0) {
        for (const channel of openTickets) {
            console.log(
                `🎫 Existing ticket: ${channel.name} (${channel.id})`
            );
        }
    }

    return openTickets;
}


async function createTicket({
    guild,
    user,
    type,
    subject,
    details
}) {
    const ticketType =
        config.ticketTypes[type];

    if (!ticketType) {
        throw new Error(
            `Unknown ticket type: ${type}`
        );
    }

    const botMember = guild.members.me;

    if (!botMember) {
        throw new Error(
            "Could not resolve bot member."
        );
    }

    if (
        !botMember.permissions.has(
            PermissionFlagsBits.ManageChannels
        )
    ) {
        throw new Error(
            "TruckWorks Bot is missing the Manage Channels server permission."
        );
    }

    const existing =
        await getUserOpenTickets(
            guild,
            user.id
        );

    console.log(
        "========== TICKET LIMIT DEBUG =========="
    );
    console.log(
        "User ID:",
        user.id
    );
    console.log(
        "Ticket Type:",
        type
    );
    console.log(
        "Existing tickets:",
        existing.length
    );
    console.log(
        "Max open tickets:",
        config.settings.maxOpenTicketsPerUser
    );
    console.log(
        "Existing ticket channels:",
        existing.map(channel => ({
            id: channel?.id,
            name: channel?.name,
            topic: channel?.topic
        }))
    );
    console.log(
        "========================================="
    );

    if (
        existing.length >=
        config.settings.maxOpenTicketsPerUser
    ) {
        const existingChannel =
            existing[0];

        return {
            success: false,
            reason: "MAX_TICKETS",
            channel: existingChannel || null
        };
    }

    const category =
        findCategory(
            guild,
            ticketType.category
        );

    if (!category) {
        return {
            success: false,
            reason: "CATEGORY_NOT_FOUND",
            categoryName: ticketType.category
        };
    }

    const staffRole =
        findStaffRole(
            guild,
            ticketType.staffRole
        );

    const ticketNumber =
        getNextTicketNumber(guild);

    const channelName =
        `${config.settings.ticketPrefix}-${ticketNumber}`;

    const permissionOverwrites = [
        {
            id: guild.roles.everyone.id,
            deny: [
                PermissionFlagsBits.ViewChannel
            ]
        },

        {
            id: user.id,
            allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.AttachFiles,
                PermissionFlagsBits.EmbedLinks
            ]
        }
    ];

    if (staffRole) {
        permissionOverwrites.push({
            id: staffRole.id,
            allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.ManageMessages,
                PermissionFlagsBits.AttachFiles,
                PermissionFlagsBits.EmbedLinks
            ]
        });
    }

    const channel =
        await guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            parent: category.id,
            permissionOverwrites
        });

    const info = {
        type,
        ownerId: user.id,
        ticketNumber,
        status: "open",
        claimedBy: null,
        closedBy: null,
        closeReason: null
    };

    await updateTicketTopic(
        channel,
        info
    );

    return {
        success: true,
        channel,
        ticketNumber,
        ticketType,
        staffRole,
        subject,
        details
    };
}

module.exports = {
    createTicket,
    resolveTicketChannel,
    getTicketInfo,
    updateTicketTopic,
    findCategory,
    findStaffRole,
    getUserOpenTickets
};
