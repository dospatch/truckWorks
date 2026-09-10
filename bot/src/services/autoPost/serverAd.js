const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

async function postServerAd(client) {
    const channelId = process.env.SERVER_AD_CHANNEL_ID;

    if (!channelId) {
        console.log("[AUTOPOST] SERVER_AD_CHANNEL_ID is not configured.");
        return;
    }

    const channel = await client.channels.fetch(channelId).catch(() => null);

    if (!channel) {
        console.error("[AUTOPOST] Could not find the configured server ad channel.");
        return;
    }

    if (!channel.isTextBased()) {
        console.error("[AUTOPOST] Configured server ad channel is not text based.");
        return;
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

    await channel.send({
        content: "🚨 **SERVER OWNERS — THIS ONE IS FOR YOU!** 🚨",
        embeds: [embed],
        components: [row]
    });

    console.log(`[AUTOPOST] Server recruitment advertisement posted in #${channel.name}.`);
}

module.exports = {
    postServerAd
};
