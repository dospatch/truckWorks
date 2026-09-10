const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const fs = require("fs");
const path = require("path");

async function getChannel(client, envName) {
    const channelId = process.env[envName];

    if (!channelId) {
        return null;
    }

    const channel = await client.channels.fetch(channelId).catch(() => null);

    if (!channel || !channel.isTextBased()) {
        console.error(`[AUTOPOST] Invalid channel configured in ${envName}.`);
        return null;
    }

    return channel;
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
    const channel = await getChannel(client, "CONVOY_AUTOPOST_CHANNEL_ID");
    if (!channel) return;

    const guild = channel.guild;
    const events = await guild.scheduledEvents.fetch().catch(() => null);

    if (!events) return;

    const now = Date.now();
    const convoys = [...events.values()]
        .filter(event =>
            event.scheduledStartTimestamp > now &&
            event.name.toLowerCase().includes("convoy")
        )
        .sort((a, b) => a.scheduledStartTimestamp - b.scheduledStartTimestamp)
        .slice(0, 5);

    if (!convoys.length) {
        return;
    }

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

    await channel.send({
        content: "📢 **UPCOMING CONVOYS** — mark your calendar!",
        embeds: [embed]
    });
}

async function postVtcRecruitment(client) {
    const channel = await getChannel(client, "VTC_AUTOPOST_CHANNEL_ID");
    if (!channel) return;

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

    await channel.send({
        content: "🚨 **VTC OWNERS — YOUR NEXT STOP IS TRUCK WORKS!** 🚨",
        embeds: [embed],
        components: [addWebsiteButtons()]
    });
}

async function postMaintenanceNotice(client) {
    const channel = await getChannel(client, "MAINTENANCE_AUTOPOST_CHANNEL_ID");
    if (!channel) return;

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

    await channel.send({ embeds: [embed] });
}

async function postChangelogUpdate(client) {
    const channel = await getChannel(client, "CHANGELOG_AUTOPOST_CHANNEL_ID");
    if (!channel) return;

    const changelogPath = path.join(__dirname, "../../../../CHANGELOG.md");

    if (!fs.existsSync(changelogPath)) {
        console.error("[AUTOPOST] CHANGELOG.md was not found.");
        return;
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

    await channel.send({ embeds: [embed] });
}

module.exports = {
    getChannel,
    addWebsiteButtons,
    postConvoyUpdate,
    postVtcRecruitment,
    postMaintenanceNotice,
    postChangelogUpdate
};
