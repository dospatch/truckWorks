const {
    ChannelType,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const applicationChannels =
    require("../config/applicationRequirements/applicationChannels");

const {
    requirements,
    questions
} = require("../config/applicationRequirements");

const APPLICATION_TYPES = [
    "staff",
    "driver",
    "vtc",
    "event",
    "creator",
    "moderation"
];

const APPLICATION_NAMES = {
    staff: "🛠️ Staff Application",
    driver: "🚛 Driver Application",
    vtc: "🚚 VTC Application",
    event: "🎉 Event Team Application",
    creator: "🎥 Creator Application",
    moderation: "🛡️ Moderation Application"
};

const APPLICATION_DESCRIPTIONS = {
    staff:
        "Interested in joining the BC TruckWorks Staff Team? Review the requirements before starting your application.",
    driver:
        "Want to become an official BC TruckWorks Driver? Review the driver requirements before applying.",
    vtc:
        "Interested in bringing your VTC into the BC TruckWorks community? Review the requirements before applying.",
    event:
        "Want to help organize BC TruckWorks events and convoys? Review the requirements before applying.",
    creator:
        "Want to become a BC TruckWorks Creator? Review the requirements before applying.",
    moderation:
        "Interested in helping moderate the BC TruckWorks community? Review the requirements before applying."
};

function normalize(name) {
    return String(name || "")
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[^\x00-\x7F]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function getTypeFromRequirementChannel(name) {
    const normalized = normalize(name);

    for (const type of APPLICATION_TYPES) {
        if (
            normalized === `${type}-requirements` ||
            normalized === type
        ) {
            return type;
        }
    }

    return null;
}

async function findCategory(guild, name) {
    const target = normalize(name);

    return guild.channels.cache.find(
        channel =>
            channel.type === ChannelType.GuildCategory &&
            normalize(channel.name) === target
    ) || null;
}

async function getOrCreateCategory(guild, name, options = {}) {
    let category = await findCategory(guild, name);

    if (!category) {
        category = await guild.channels.create({
            name,
            type: ChannelType.GuildCategory,
            ...options
        });

        console.log(`📁 Created category: ${name}`);
    } else {
        console.log(`📁 Existing category: ${name}`);
    }

    return category;
}

async function findTextChannel(guild, name) {
    const target = normalize(name);

    return guild.channels.cache.find(
        channel =>
            channel.type === ChannelType.GuildText &&
            normalize(channel.name) === target
    ) || null;
}

async function getOrCreateTextChannel(
    guild,
    category,
    name,
    options = {}
) {
    let channel = await findTextChannel(guild, name);

    if (!channel) {
        channel = await guild.channels.create({
            name,
            type: ChannelType.GuildText,
            parent: category.id,
            ...options
        });

        console.log(`  ✅ Created channel: ${name}`);
    } else {
        if (channel.parentId !== category.id) {
            await channel.setParent(category.id);
            console.log(`  ↪️ Moved channel: ${name}`);
        } else {
            console.log(`  ℹ️ Existing channel: ${name}`);
        }
    }

    return channel;
}

function makeRequirementEmbed(type) {
    const data = requirements[type];

    if (!data) {
        return new EmbedBuilder()
            .setTitle("📋 Application Requirements")
            .setDescription(
                "Please review the requirements before submitting an application."
            )
            .setColor(0x5865F2)
            .setTimestamp();
    }

    const embed = new EmbedBuilder()
        .setTitle(data.title || "📋 Application Requirements")
        .setDescription(
            data.description ||
            "Please review these requirements before applying."
        )
        .setColor(0x5865F2)
        .setFooter({
            text: "BC TruckWorks • Application Requirements"
        })
        .setTimestamp();

    if (
        Array.isArray(data.requirements) &&
        data.requirements.length
    ) {
        const value = data.requirements
            .map(item => `• ${item}`)
            .join("\n");

        embed.addFields({
            name: "📋 Requirements",
            value: value.slice(0, 1024)
        });
    }

    if (
        Array.isArray(data.applicationProcess) &&
        data.applicationProcess.length
    ) {
        const value = data.applicationProcess
            .map((item, index) => `${index + 1}. ${item}`)
            .join("\n");

        embed.addFields({
            name: "🔄 Application Process",
            value: value.slice(0, 1024)
        });
    }

    if (
        Array.isArray(data.importantNotes) &&
        data.importantNotes.length
    ) {
        const value = data.importantNotes
            .map(item => `• ${item}`)
            .join("\n");

        embed.addFields({
            name: "⚠️ Important Notes",
            value: value.slice(0, 1024)
        });
    }

    if (questions[type]) {
        embed.addFields({
            name: "📝 Application Questions",
            value:
                `${questions[type].length} question(s) will be asked during the application.`
        });
    }

    return embed;
}

function makeApplicationPanel(type) {
    const embed = new EmbedBuilder()
        .setTitle(
            APPLICATION_NAMES[type] ||
            "📝 BC TruckWorks Application"
        )
        .setDescription(
            APPLICATION_DESCRIPTIONS[type] ||
            "Review the requirements before starting your application."
        )
        .addFields({
            name: "📋 Before You Apply",
            value:
                `Please review the ${type}-requirements channel first.\n\n` +
                "By starting this application, you agree to provide honest and accurate information."
        })
        .setColor(0x5865F2)
        .setFooter({
            text: "BC TruckWorks • Applications"
        })
        .setTimestamp();

    const button = new ButtonBuilder()
        .setCustomId(`application_start_${type}`)
        .setLabel("Start Application")
        .setEmoji("📝")
        .setStyle(ButtonStyle.Primary);

    return {
        embeds: [embed],
        components: [
            new ActionRowBuilder().addComponents(button)
        ]
    };
}

async function findBotMessage(channel, marker) {
    const messages = await channel.messages.fetch({
        limit: 50
    });

    return messages.find(
        message =>
            message.author.id === channel.client.user.id &&
            message.embeds.some(embed =>
                String(embed.footer?.text || "").includes(marker)
            )
    ) || null;
}

async function deployRequirementMessage(channel, type) {
    const embed = makeRequirementEmbed(type);

    const existing = await findBotMessage(
        channel,
        "Application Requirements"
    );

    if (existing) {
        await existing.edit({
            embeds: [embed],
            components: []
        });

        return "updated";
    }

    await channel.send({
        embeds: [embed]
    });

    return "created";
}

async function deployApplicationMessage(channel, type) {
    const payload = makeApplicationPanel(type);

    const existing = await findBotMessage(
        channel,
        "BC TruckWorks • Applications"
    );

    if (existing) {
        await existing.edit(payload);
        return "updated";
    }

    await channel.send(payload);
    return "created";
}

async function setupRequirements(guild) {
    const stats = {
        categoryCreated: 0,
        channelsCreated: 0,
        messagesCreated: 0,
        messagesUpdated: 0
    };

    const categoryConfig = applicationChannels.requirements;

    const category = await getOrCreateCategory(
        guild,
        categoryConfig.category || categoryConfig.name
    );

    for (const channelConfig of categoryConfig.channels || []) {
        const channel = await getOrCreateTextChannel(
            guild,
            category,
            channelConfig.name
        );

        const type =
            channelConfig.type ||
            getTypeFromRequirementChannel(channelConfig.name);

        if (!type || !APPLICATION_TYPES.includes(type)) {
            continue;
        }

        const status = await deployRequirementMessage(
            channel,
            type
        );

        if (status === "created") {
            stats.messagesCreated++;
        } else {
            stats.messagesUpdated++;
        }

        stats.channelsCreated++;
    }

    return {
        category,
        stats
    };
}

async function setupApplications(guild) {
    const stats = {
        channels: 0,
        messagesCreated: 0,
        messagesUpdated: 0
    };

    const categoryConfig = applicationChannels.applications;

    const category = await getOrCreateCategory(
        guild,
        categoryConfig.category || categoryConfig.name
    );

    for (const channelConfig of categoryConfig.channels || []) {
        const type = channelConfig.type;

        if (!type || !APPLICATION_TYPES.includes(type)) {
            continue;
        }

        const channel = await getOrCreateTextChannel(
            guild,
            category,
            channelConfig.name
        );

        const status = await deployApplicationMessage(
            channel,
            type
        );

        if (status === "created") {
            stats.messagesCreated++;
        } else {
            stats.messagesUpdated++;
        }

        stats.channels++;
    }

    return {
        category,
        stats
    };
}

async function setupApplicationReview(guild) {
    const reviewConfig = applicationChannels.review;

    const category = await getOrCreateCategory(
        guild,
        reviewConfig.category || reviewConfig.name,
        {
            permissionOverwrites: [
                {
                    id: guild.roles.everyone.id,
                    deny: [
                        PermissionFlagsBits.ViewChannel
                    ]
                }
            ]
        }
    );

    await category.permissionOverwrites.edit(
        guild.roles.everyone,
        {
            ViewChannel: false
        }
    );

    const channels = [];

    for (const channelConfig of reviewConfig.channels || []) {
        const channel = await getOrCreateTextChannel(
            guild,
            category,
            channelConfig.name,
            {
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone.id,
                        deny: [
                            PermissionFlagsBits.ViewChannel
                        ]
                    }
                ]
            }
        );

        await channel.permissionOverwrites.edit(
            guild.roles.everyone,
            {
                ViewChannel: false
            }
        );

        channels.push(channel);
    }

    return {
        category,
        channels
    };
}

async function setupApplicationSystem(guild) {
    console.log(`
╔════════════════════════════════════════════╗
║       🚛 BC TRUCKWORKS APPLICATIONS       ║
╚════════════════════════════════════════════╝
`);

    const result = {
        requirements: {
            category: null,
            channels: 0,
            messagesCreated: 0,
            messagesUpdated: 0
        },
        applications: {
            category: null,
            channels: 0,
            messagesCreated: 0,
            messagesUpdated: 0
        },
        review: {
            category: null,
            channels: 0
        }
    };

    const requirementResult =
        await setupRequirements(guild);

    result.requirements.category =
        requirementResult.category;

    result.requirements.channels =
        requirementResult.stats.channelsCreated;

    result.requirements.messagesCreated =
        requirementResult.stats.messagesCreated;

    result.requirements.messagesUpdated =
        requirementResult.stats.messagesUpdated;

    const applicationResult =
        await setupApplications(guild);

    result.applications.category =
        applicationResult.category;

    result.applications.channels =
        applicationResult.stats.channels;

    result.applications.messagesCreated =
        applicationResult.stats.messagesCreated;

    result.applications.messagesUpdated =
        applicationResult.stats.messagesUpdated;

    const reviewResult =
        await setupApplicationReview(guild);

    result.review.category =
        reviewResult.category;

    result.review.channels =
        reviewResult.channels.length;

    console.log(`
╔════════════════════════════════════════════╗
║       ✅ APPLICATION SYSTEM READY          ║
╠════════════════════════════════════════════╣
║ 📋 Requirements: configured               ║
║ 📝 Applications: configured               ║
║ 🔐 Review: configured                     ║
╚════════════════════════════════════════════╝
`);

    return result;
}

module.exports = {
    APPLICATION_TYPES,
    setupApplicationSystem,
    setupRequirements,
    setupApplications,
    setupApplicationReview,
    deployRequirementMessage,
    deployApplicationMessage,
    makeRequirementEmbed,
    makeApplicationPanel
};
