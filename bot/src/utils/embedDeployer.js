const {
    ChannelType,
    PermissionFlagsBits
} = require("discord.js");

const {
    getTemplate,
    getTemplateNames
} = require("../config/embedTemplates");

function normalize(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
}

function findTextChannel(guild, name) {
    const wanted = normalize(name);

    return guild.channels.cache.find(channel => {
        if (channel.type !== ChannelType.GuildText) {
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

async function deployEmbedTemplate(channel) {
    const embed = getTemplate(channel.name);

    if (!embed) {
        return {
            success: false,
            reason: "TEMPLATE_NOT_FOUND"
        };
    }

    const messages = await channel.messages.fetch({
        limit: 50
    });

    const botMessages = messages.filter(
        message =>
            message.author.id === channel.client.user.id &&
            message.embeds.length > 0
    );

    const existing = botMessages.first();

    if (existing) {
        await existing.edit({
            embeds: [embed]
        });

        return {
            success: true,
            action: "updated",
            message: existing
        };
    }

    const message = await channel.send({
        embeds: [embed]
    });

    return {
        success: true,
        action: "created",
        message
    };
}

async function deployAllEmbedTemplates(guild) {
    const botMember = guild.members.me;

    if (!botMember) {
        throw new Error("Could not resolve TruckWorks Bot member.");
    }

    if (
        !botMember.permissions.has(
            PermissionFlagsBits.ManageMessages
        )
    ) {
        throw new Error(
            "TruckWorks Bot needs Manage Messages to deploy and update embed templates."
        );
    }

    const results = [];

    for (const channelName of getTemplateNames()) {
        const channel = findTextChannel(
            guild,
            channelName
        );

        if (!channel) {
            results.push({
                channel: channelName,
                status: "missing"
            });

            continue;
        }

        try {
            const result =
                await deployEmbedTemplate(channel);

            results.push({
                channel: channelName,
                status:
                    result.action === "updated"
                        ? "updated"
                        : "created"
            });

        } catch (error) {
            console.error(
                `❌ Failed to deploy ${channelName}:`,
                error
            );

            results.push({
                channel: channelName,
                status: "error",
                error: error.message
            });
        }
    }

    return results;
}

module.exports = {
    deployEmbedTemplate,
    deployAllEmbedTemplates,
    findTextChannel
};
