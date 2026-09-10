const {
    ChannelType,
    PermissionFlagsBits
} = require("discord.js");

const {
    normalizeChannelName,
    findChannel
} = require("./channelUtils");

const CATEGORY_NAME = "application-requirements";

const REQUIREMENT_CHANNELS = [
    {
        name: "staff-requirements",
        topic: "BC TruckWorks Staff Application Requirements and information."
    },
    {
        name: "driver-requirements",
        topic: "BC TruckWorks Driver Application Requirements and information."
    },
    {
        name: "vtc-requirements",
        topic: "BC TruckWorks VTC Requirements and information."
    },
    {
        name: "event-requirements",
        topic: "BC TruckWorks Event Requirements and information."
    },
    {
        name: "creator-requirements",
        topic: "BC TruckWorks Creator Requirements and information."
    },
    {
        name: "moderation-requirements",
        topic: "BC TruckWorks Moderation Requirements and information."
    },
    {
        name: "application-faq",
        topic: "Frequently asked questions about BC TruckWorks applications."
    }
];

async function ensureApplicationRequirementsChannels(guild) {
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
            "TruckWorks Bot needs Manage Channels to create application requirement channels."
        );
    }

    let category = findChannel(
        guild,
        [CATEGORY_NAME]
    );

    let categoryCreated = false;

    if (
        !category ||
        category.type !== ChannelType.GuildCategory
    ) {
        category = await guild.channels.create({
            name: "📋 APPLICATION REQUIREMENTS",
            type: ChannelType.GuildCategory
        });

        categoryCreated = true;
    }

    const result = {
        categoryCreated,
        categoryName: category.name,
        channelsCreated: [],
        channelsExisting: [],
        channelsMoved: [],
        errors: []
    };

    for (const requirement of REQUIREMENT_CHANNELS) {
        try {
            let channel = findChannel(
                guild,
                [requirement.name]
            );

            if (
                channel &&
                channel.type !== ChannelType.GuildText
            ) {
                result.errors.push(
                    `${requirement.name}: existing channel is not a text channel`
                );

                continue;
            }

            if (!channel) {
                channel = await guild.channels.create({
                    name: requirement.name,
                    type: ChannelType.GuildText,
                    parent: category.id,
                    topic: requirement.topic,
                    permissionOverwrites: [
                        {
                            id: guild.roles.everyone.id,
                            allow: [
                                PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.ReadMessageHistory
                            ],
                            deny: [
                                PermissionFlagsBits.SendMessages
                            ]
                        },
                        {
                            id: botMember.id,
                            allow: [
                                PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.SendMessages,
                                PermissionFlagsBits.ReadMessageHistory,
                                PermissionFlagsBits.ManageMessages
                            ]
                        }
                    ]
                });

                result.channelsCreated.push(
                    requirement.name
                );

                continue;
            }

            result.channelsExisting.push(
                channel.name
            );

            if (channel.parentId !== category.id) {
                await channel.setParent(
                    category.id,
                    {
                        lockPermissions: false
                    }
                );

                result.channelsMoved.push(
                    channel.name
                );
            }

            await channel.permissionOverwrites.edit(
                guild.roles.everyone,
                {
                    ViewChannel: true,
                    ReadMessageHistory: true,
                    SendMessages: false
                }
            );

            await channel.permissionOverwrites.edit(
                botMember,
                {
                    ViewChannel: true,
                    SendMessages: true,
                    ReadMessageHistory: true,
                    ManageMessages: true
                }
            );

        } catch (error) {
            console.error(
                `❌ Failed application requirement channel ${requirement.name}:`,
                error
            );

            result.errors.push(
                `${requirement.name}: ${error.message}`
            );
        }
    }

    return result;
}

module.exports = {
    ensureApplicationRequirementsChannels
};
