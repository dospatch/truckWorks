const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const embedChannelConfig = require("../embedChannelConfig");

async function postServerAd(client) {
    const config = embedChannelConfig.get("server_recruitment");

    if (!config?.enabled || !Array.isArray(config.channelIds) || !config.channelIds.length) {
        return 0;
    }

    const embed = new EmbedBuilder()
        .setTitle("🚛 BC TRUCK WORKS — SERVER OWNERS WANTED!")
        .setDescription(
            "Ready to take your trucking community to the next level?\n\n" +
            "BC TRUCK WORKS gives trucking communities the tools they need to manage and grow their ATS and ETS2 servers."
        )
        .addFields(
            {
                name: "🚛 Server Management",
                value: "Manage your dedicated trucking servers from one central platform.",
                inline: true
            },
            {
                name: "🎮 ATS & ETS2",
                value: "Built with American Truck Simulator and Euro Truck Simulator 2 communities in mind.",
                inline: true
            },
            {
                name: "🤖 Server Agent",
                value: "Connect your dedicated server using the TruckWorks server agent.",
                inline: true
            },
            {
                name: "📊 Dashboard",
                value: "Monitor and manage your servers through the TruckWorks web platform.",
                inline: true
            },
            {
                name: "🔐 Licensing",
                value: "Secure server registration and licensing built into the platform.",
                inline: true
            },
            {
                name: "🌐 VTC Support",
                value: "Build and manage your trucking organization alongside your servers.",
                inline: true
            }
        )
        .setColor(0xF5C400)
        .setFooter({
            text: "BC TRUCK WORKS • Built for Trucking Communities"
        })
        .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setLabel("🌐 Visit Website")
            .setStyle(ButtonStyle.Link)
            .setURL("https://truck-works.vercel.app/"),
        new ButtonBuilder()
            .setLabel("🚛 Register Your Server")
            .setStyle(ButtonStyle.Link)
            .setURL("https://truck-works.vercel.app/dashboard/servers/add")
    );

    let posted = 0;

    for (const channelId of [...new Set(config.channelIds.filter(Boolean))]) {
        const channel = await client.channels.fetch(channelId).catch(() => null);

        if (!channel || !channel.isTextBased()) {
            console.error(`[AUTOPOST] Invalid channel configured: ${channelId}`);
            continue;
        }

        await channel.send({
            content: "🚨 **SERVER OWNERS — THIS ONE IS FOR YOU!** 🚨",
            embeds: [embed],
            components: [row]
        });

        posted++;
        console.log(`[AUTOPOST] Server recruitment advertisement posted in #${channel.name}.`);
    }

    return posted;
}

module.exports = {
    postServerAd
};
