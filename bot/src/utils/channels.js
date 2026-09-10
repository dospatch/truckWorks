const {
    ChannelType,
    PermissionFlagsBits
} = require("discord.js");

const {
    normalizeChannelName,
    findChannel
} = require("./channelUtils");

/*
 * ============================================================
 * 🚛 BC TRUCKING WORKS
 * APPLICATION REQUIREMENTS CHANNEL SYSTEM
 * ============================================================
 */

const APPLICATION_REQUIREMENTS_CATEGORY =
    "application-requirements";

/*
 * ============================================================
 * APPLICATION REQUIREMENTS CHANNELS
 * ============================================================
 */

const APPLICATION_REQUIREMENT_CHANNELS = [
    {
        name: "staff-requirements",
        topic:
            "Official BC TRUCKING WORKS Staff Application Requirements.",
        emoji: "📋"
    },

    {
        name: "driver-requirements",
        topic:
            "Official BC TRUCKING WORKS Driver Application Requirements.",
        emoji: "🚛"
    },

    {
        name: "vtc-requirements",
        topic:
            "Official BC TRUCKING WORKS VTC Application Requirements.",
        emoji: "🤝"
    },

    {
        name: "event-requirements",
        topic:
            "Official BC TRUCKING WORKS Event Application Requirements.",
        emoji: "📅"
    },

    {
        name: "creator-requirements",
        topic:
            "Official BC TRUCKING WORKS Creator Application Requirements.",
        emoji: "🎨"
    },

    {
        name: "moderation-requirements",
        topic:
            "Official BC TRUCKING WORKS Moderation Application Requirements.",
        emoji: "🛡️"
    },

    {
        name: "application-faq",
        topic:
            "Frequently Asked Questions about BC TRUCKING WORKS applications.",
        emoji: "❓"
    }
];

/*
 * ============================================================
 * FIND APPLICATION REQUIREMENTS CATEGORY
 * ============================================================
 */

function findApplicationRequirementsCategory(guild) {
    if (!guild) {
        return null;
    }

    return guild.channels.cache.find(channel => {
        if (
            channel.type !== ChannelType.GuildCategory ||
            !channel.name
        ) {
            return false;
        }

        return (
            normalizeChannelName(channel.name) ===
            normalizeChannelName(
                APPLICATION_REQUIREMENTS_CATEGORY
            )
        );
    });
}

/*
 * ============================================================
 * CREATE APPLICATION REQUIREMENTS CATEGORY
 * ============================================================
 */

async function ensureApplicationRequirementsCategory(guild) {
    let category =
        findApplicationRequirementsCategory(guild);

    if (category) {
        return {
            category,
            created: false
        };
    }

    category = await guild.channels.create({
        name: "📋 APPLICATION REQUIREMENTS",
        type: ChannelType.GuildCategory
    });

    console.log(
        `✅ Created category: ${category.name}`
    );

    return {
        category,
        created: true
    };
}

/*
 * ============================================================
 * CREATE / VERIFY REQUIREMENTS CHANNELS
 * ============================================================
 */

async function ensureApplicationRequirementsChannels(guild) {
    if (!guild) {
        throw new Error(
            "Guild could not be resolved."
        );
    }

    const botMember = guild.members.me;

    if (!botMember) {
        throw new Error(
            "Bot member could not be resolved."
        );
    }

    if (
        !botMember.permissions.has(
            PermissionFlagsBits.ManageChannels
        )
    ) {
        throw new Error(
            "Bot requires Manage Channels permission."
        );
    }

    const categoryResult =
        await ensureApplicationRequirementsCategory(
            guild
        );

    const category =
        categoryResult.category;

    const results = {
        categoryCreated:
            categoryResult.created,

        categoryName:
            category.name,

        channelsCreated: [],

        channelsExisting: [],

        channelsMoved: [],

        errors: []
    };

    /*
     * ========================================================
     * CREATE EACH REQUIREMENTS CHANNEL
     * ========================================================
     */

    for (
        const channelConfig
        of APPLICATION_REQUIREMENT_CHANNELS
    ) {
        try {
            let channel =
                findChannel(
                    guild,
                    [channelConfig.name]
                );

            /*
             * Only use text channels for the
             * requirements system.
             */

            if (
                channel &&
                channel.type !==
                    ChannelType.GuildText
            ) {
                channel = null;
            }

            /*
             * ==================================================
             * EXISTING CHANNEL
             * ==================================================
             */

            if (channel) {
                if (
                    channel.parentId !==
                    category.id
                ) {
                    await channel.setParent(
                        category.id,
                        {
                            lockPermissions: false
                        }
                    );

                    results.channelsMoved.push(
                        channelConfig.name
                    );

                    console.log(
                        `📂 Moved #${channelConfig.name} into ${category.name}`
                    );
                }

                /*
                 * Update the topic if possible.
                 */

                if (
                    channel.topic !==
                    channelConfig.topic
                ) {
                    await channel
                        .setTopic(
                            channelConfig.topic
                        )
                        .catch(() => {});
                }

                /*
                 * Make the channel read-only
                 * for @everyone.
                 */

                await channel.permissionOverwrites
                    .edit(
                        guild.roles.everyone,
                        {
                            ViewChannel: true,
                            ReadMessageHistory: true,
                            SendMessages: false
                        }
                    )
                    .catch(() => {});

                results.channelsExisting.push(
                    channelConfig.name
                );

                continue;
            }

            /*
             * ==================================================
             * CREATE NEW CHANNEL
             * ==================================================
             */

            channel =
                await guild.channels.create({
                    name:
                        channelConfig.name,

                    type:
                        ChannelType.GuildText,

                    parent:
                        category.id,

                    topic:
                        channelConfig.topic,

                    permissionOverwrites: [
                        {
                            id:
                                guild.roles
                                    .everyone
                                    .id,

                            allow: [
                                PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.ReadMessageHistory
                            ],

                            deny: [
                                PermissionFlagsBits.SendMessages
                            ]
                        },

                        {
                            id:
                                botMember.id,

                            allow: [
                                PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.SendMessages,
                                PermissionFlagsBits.ReadMessageHistory,
                                PermissionFlagsBits.ManageMessages
                            ]
                        }
                    ]
                });

            results.channelsCreated.push(
                channelConfig.name
            );

            console.log(
                `✅ Created #${channelConfig.name}`
            );

        } catch (error) {
            results.errors.push({
                channel:
                    channelConfig.name,

                error:
                    error.message
            });

            console.error(
                `❌ Failed to configure #${channelConfig.name}:`,
                error.message
            );
        }
    }

    return results;
}

/*
 * ============================================================
 * GET CHANNEL CONFIGURATION
 * ============================================================
 */

function getApplicationRequirementChannels() {
    return APPLICATION_REQUIREMENT_CHANNELS;
}

/*
 * ============================================================
 * GET REQUIREMENTS CHANNEL
 * ============================================================
 */

function getApplicationRequirementChannel(
    guild,
    channelName
) {
    if (!guild || !channelName) {
        return null;
    }

    return findChannel(
        guild,
        [channelName]
    );
}

/*
 * ============================================================
 * EXPORTS
 * ============================================================
 */

module.exports = {
    APPLICATION_REQUIREMENTS_CATEGORY,

    APPLICATION_REQUIREMENT_CHANNELS,

    findApplicationRequirementsCategory,

    ensureApplicationRequirementsCategory,

    ensureApplicationRequirementsChannels,

    getApplicationRequirementChannels,

    getApplicationRequirementChannel
};