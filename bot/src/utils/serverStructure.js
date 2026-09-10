const {
    ChannelType,
    PermissionFlagsBits
} = require("discord.js");

const SERVER_STRUCTURE = [
    {
        name: "COMMUNITY & EVENTS",
        channels: [
            "convoy-planning",
            "event-signups",
            "events",
            "event-applications",
            "showcase"
        ]
    },
    {
        name: "CREATORS",
        channels: [
            "creator-ideas",
            "creator-showcase"
        ]
    },
    {
        name: "VTC CENTER",
        channels: [
            "vtc-partnerships",
            "vtc-recruitment",
            "vtc-advertisements"
        ]
    },
    {
        name: "MODS",
        channels: [
            "mod-upload",
            "mod-submission",
            "mod-bug-support",
            "mod-ideas",
            "mod-testing",
            "mod-changelogs"
        ]
    },
    {
        name: "TRUCKWORKS INFORMATION",
        channels: [
            "truckworks-guide",
            "getting-started",
            "choose-your-game",
            "choose-your-roles"
        ]
    },
    {
        name: "SERVER NETWORK",
        channels: [
            "server-status",
            "server-events",
            "server-support",
            "server-applications",
            "ets2-servers",
            "ats-servers",
            "server-listings",
            "server-advertisement"
        ]
    },
    {
        name: "WELCOME",
        channels: [
            "welcome"
        ]
    }
];

function normalizeName(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "");
}

function findCategory(guild, name) {
    const normalized = normalizeName(name);

    return guild.channels.cache.find(channel =>
        channel.type === ChannelType.GuildCategory &&
        (
            channel.name.toLowerCase() === name.toLowerCase() ||
            normalizeName(channel.name) === normalized
        )
    );
}

function findChannel(guild, name) {
    const normalized = normalizeName(name);

    return guild.channels.cache.find(channel =>
        channel.type === ChannelType.GuildText &&
        (
            channel.name.toLowerCase() === name.toLowerCase() ||
            normalizeName(channel.name) === normalized
        )
    );
}

async function ensureCategory(guild, name) {
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

    console.log(`📁 Created category: ${name}`);

    return {
        category,
        created: true
    };
}

async function ensureChannel(guild, category, name) {
    let channel = findChannel(guild, name);

    if (channel) {
        /*
         * If the channel already exists but is not inside
         * the expected TruckWorks category, move it.
         */
        if (channel.parentId !== category.id) {
            try {
                await channel.setParent(category.id, {
                    lockPermissions: false
                });

                console.log(
                    `↪️ Moved #${channel.name} into ${category.name}`
                );
            } catch (error) {
                console.warn(
                    `⚠️ Could not move #${channel.name}:`,
                    error.message
                );
            }
        }

        return {
            channel,
            created: false
        };
    }

    channel = await guild.channels.create({
        name,
        type: ChannelType.GuildText,
        parent: category.id
    });

    console.log(
        `📝 Created #${name} under ${category.name}`
    );

    return {
        channel,
        created: true
    };
}

async function ensureServerStructure(guild) {
    if (!guild) {
        throw new Error("Guild could not be resolved.");
    }

    const botMember = guild.members.me;

    if (!botMember) {
        throw new Error(
            "Could not resolve TruckWorks Bot member."
        );
    }

    if (
        !botMember.permissions.has(
            PermissionFlagsBits.ManageChannels
        )
    ) {
        throw new Error(
            "TruckWorks Bot needs Manage Channels to create and organize the TruckWorks server."
        );
    }

    const results = {
        categoriesCreated: 0,
        categoriesExisting: 0,
        channelsCreated: 0,
        channelsExisting: 0,
        channelsMoved: 0,
        errors: []
    };

    for (const group of SERVER_STRUCTURE) {
        try {
            const categoryResult =
                await ensureCategory(
                    guild,
                    group.name
                );

            if (categoryResult.created) {
                results.categoriesCreated++;
            } else {
                results.categoriesExisting++;
            }

            const category =
                categoryResult.category;

            for (const channelName of group.channels) {
                try {
                    const beforeParent =
                        findChannel(
                            guild,
                            channelName
                        )?.parentId;

                    const result =
                        await ensureChannel(
                            guild,
                            category,
                            channelName
                        );

                    if (result.created) {
                        results.channelsCreated++;
                    } else {
                        results.channelsExisting++;

                        if (
                            beforeParent &&
                            beforeParent !== category.id
                        ) {
                            results.channelsMoved++;
                        }
                    }
                } catch (error) {
                    console.error(
                        `❌ Failed to create/configure #${channelName}:`,
                        error
                    );

                    results.errors.push({
                        type: "channel",
                        channel: channelName,
                        error: error.message
                    });
                }
            }
        } catch (error) {
            console.error(
                `❌ Failed to create/configure ${group.name}:`,
                error
            );

            results.errors.push({
                type: "category",
                category: group.name,
                error: error.message
            });
        }
    }

    return results;
}

function getServerStructure() {
    return SERVER_STRUCTURE;
}

module.exports = {
    SERVER_STRUCTURE,
    ensureServerStructure,
    getServerStructure
};
