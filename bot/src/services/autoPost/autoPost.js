const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const fs = require("fs");
const path = require("path");
const embedChannelConfig = require("../embedChannelConfig");

async function getChannel(client, channelId) {
    if (!channelId) {
        return null;
    }

    const channel = await client.channels.fetch(channelId).catch(() => null);

    if (!channel || !channel.isTextBased()) {
        console.error(`[AUTOPOST] Invalid channel configured: ${channelId}`);
        return null;
    }

    return channel;
}

function configuredChannels(type) {
    const config = embedChannelConfig.get(type);

    if (!config?.enabled || !Array.isArray(config.channelIds)) {
        return [];
    }

    return [...new Set(config.channelIds.filter(Boolean))];
}

async function getConfiguredChannels(client, type) {
    const channels = [];

    for (const channelId of configuredChannels(type)) {
        const channel = await getChannel(client, channelId);
        if (channel) {
            channels.push(channel);
        }
    }

    return channels;
}

function addWebsiteButtons(rowType = "website") {
    const row = new ActionRowBuilder();

    if (rowType === "server") {
        row.addComponents(
            new ButtonBuilder()
                .setLabel("🌐 Visit Website")
                .setStyle(ButtonStyle.Link)
                .setURL("https://truck-works.vercel.app/"),
            new ButtonBuilder()
                .setLabel("🚛 Register Server")
                .setStyle(ButtonStyle.Link)
                .setURL("https://truck-works.vercel.app/dashboard/servers/add")
        );
    } else {
        row.addComponents(
            new ButtonBuilder()
                .setLabel("🌐 Visit TruckWorks")
                .setStyle(ButtonStyle.Link)
                .setURL("https://truck-works.vercel.app/")
        );
    }

    return row;
}

async function postConvoyUpdate(client) {
    const channels = await getConfiguredChannels(client, "convoy");
    if (!channels.length) return 0;

    const sentGuilds = new Set();
    let posted = 0;

    for (const channel of channels) {
        if (sentGuilds.has(channel.guild.id)) continue;
        sentGuilds.add(channel.guild.id);

        const events = await channel.guild.scheduledEvents.fetch().catch(() => null);
        if (!events) continue;

        const now = Date.now();
        const convoys = [...events.values()]
            .filter(event =>
                event.scheduledStartTimestamp > now &&
                event.name.toLowerCase().includes("convoy")
            )
            .sort((a, b) => a.scheduledStartTimestamp - b.scheduledStartTimestamp)
            .slice(0, 5);

        if (!convoys.length) continue;

        const description = convoys
            .map(event =>
                `### 🚛 ${event.name}\n` +
                `📅 <t:${Math.floor(event.scheduledStartTimestamp / 1000)}:F>\n` +
                `⏱️ <t:${Math.floor(event.scheduledStartTimestamp / 1000)}:R>\n` +
                `${event.description || "No additional information provided."}`
            )
            .join("\n\n");

        const embed = new EmbedBuilder()
            .setTitle("🚛 Upcoming TruckWorks Convoys")
            .setDescription(description)
            .setFooter({ text: "BC TRUCK WORKS • Convoy Network" })
            .setTimestamp();

        for (const target of channels.filter(item => item.guild.id === channel.guild.id)) {
            await target.send({
                content: "📢 **UPCOMING CONVOYS** — mark your calendar!",
                embeds: [embed]
            });
            posted++;
        }
    }

    return posted;
}

async function postVtcRecruitment(client) {
    const channels = await getConfiguredChannels(client, "vtc_recruitment");
    if (!channels.length) return 0;

    const embed = new EmbedBuilder()
        .setTitle("🚛 BUILD YOUR VTC WITH BC TRUCK WORKS")
        .setDescription(
            "Running a trucking organization? Bring your VTC to the TruckWorks network.\n\n" +
            "Organize drivers, grow your community, coordinate operations, and connect your trucking organization with your TruckWorks services."
        )
        .addFields(
            { name: "👥 Driver Organization", value: "Build and manage your trucking organization.", inline: true },
            { name: "🎮 ATS & ETS2", value: "Support for the trucking games your community loves.", inline: true },
            { name: "🌐 Community Growth", value: "Give your VTC a central home and grow your network.", inline: true }
        )
        .setFooter({ text: "BC TRUCK WORKS • VTC Network" })
        .setTimestamp();

    let posted = 0;

    for (const channel of channels) {
        await channel.send({
            content: "🚨 **VTC OWNERS — YOUR NEXT STOP IS TRUCK WORKS!** 🚨",
            embeds: [embed],
            components: [addWebsiteButtons()]
        });
        posted++;
    }

    return posted;
}

async function postMaintenanceNotice(client) {
    const channels = await getConfiguredChannels(client, "maintenance");
    if (!channels.length) return 0;

    const message = process.env.MAINTENANCE_AUTOPOST_MESSAGE ||
        "TruckWorks maintenance information will be posted here when maintenance is scheduled.";

    const embed = new EmbedBuilder()
        .setTitle("🛠️ BC TRUCK WORKS — MAINTENANCE NOTICE")
        .setDescription(message)
        .addFields({
            name: "📡 Platform Status",
            value: "Please monitor this channel for service updates and completion notices."
        })
        .setFooter({ text: "BC TRUCK WORKS • Platform Operations" })
        .setTimestamp();

    let posted = 0;

    for (const channel of channels) {
        await channel.send({ embeds: [embed] });
        posted++;
    }

    return posted;
}

async function postChangelogUpdate(client) {
    const channels = await getConfiguredChannels(client, "changelog");
    if (!channels.length) return 0;

    const changelogPath = path.join(__dirname, "../../../../CHANGELOG.md");

    if (!fs.existsSync(changelogPath)) {
        console.error("[AUTOPOST] CHANGELOG.md was not found.");
        return 0;
    }

    const content = fs.readFileSync(changelogPath, "utf8");
    const sections = content.split("\n---\n").filter(Boolean);
    const latest = sections[1] || sections[0] || "No changelog entries available.";
    const trimmed = latest.slice(0, 3900);

    const embed = new EmbedBuilder()
        .setTitle("📋 BC TRUCK WORKS — LATEST UPDATE")
        .setDescription(trimmed)
        .setFooter({ text: "BC TRUCK WORKS • Changelog" })
        .setTimestamp();

    let posted = 0;

    for (const channel of channels) {
        await channel.send({ embeds: [embed] });
        posted++;
    }

    return posted;
}

module.exports = {
    getChannel,
    configuredChannels,
    getConfiguredChannels,
    addWebsiteButtons,
    postConvoyUpdate,
    postVtcRecruitment,
    postMaintenanceNotice,
    postChangelogUpdate
};
