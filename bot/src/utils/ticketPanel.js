const {
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require("discord.js");

function createTicketPanel() {
    const embed = new EmbedBuilder()
        .setTitle("🎫 TruckWorks Support Center")
        .setDescription(
            "Welcome to the **TruckWorks Support Center**.\n\n" +
            "Select the type of assistance you need from the menu below. " +
            "A private ticket will be created and the appropriate TruckWorks team will be notified.\n\n" +
            "### 📌 Ticket Guidelines\n" +
            "• Select the correct category.\n" +
            "• Provide as much information as possible.\n" +
            "• Do not create duplicate tickets.\n" +
            "• Be respectful toward staff.\n" +
            "• Use tickets for legitimate TruckWorks matters."
        )
        .addFields(
            {
                name: "🎫 General Support",
                value: "Questions and general assistance.",
                inline: true
            },
            {
                name: "🐛 Bug Report",
                value: "Report a technical issue.",
                inline: true
            },
            {
                name: "👤 Member Report",
                value: "Report a member or rule violation.",
                inline: true
            },
            {
                name: "⚖️ Appeal",
                value: "Appeal a moderation action.",
                inline: true
            },
            {
                name: "🌐 Server Support",
                value: "TruckWorks server assistance.",
                inline: true
            },
            {
                name: "🤝 VTC Partnership",
                value: "VTC partnership requests.",
                inline: true
            },
            {
                name: "🎨 Creator Support",
                value: "Creator-related assistance.",
                inline: true
            }
        )
        .setFooter({
            text: "TruckWorks • Support Center"
        })
        .setTimestamp();

    const menu = new StringSelectMenuBuilder()
        .setCustomId("ticket_create")
        .setPlaceholder("🎫 Select a support category...")
        .addOptions(
            {
                label: "General Support",
                description: "Questions or general assistance.",
                value: "general",
                emoji: "🎫"
            },
            {
                label: "Bug Report",
                description: "Report a bug or technical issue.",
                value: "bug",
                emoji: "🐛"
            },
            {
                label: "Member Report",
                description: "Report a member or rule violation.",
                value: "member",
                emoji: "👤"
            },
            {
                label: "Appeal",
                description: "Appeal a moderation action.",
                value: "appeal",
                emoji: "⚖️"
            },
            {
                label: "Server Support",
                description: "Get help with TruckWorks servers.",
                value: "server",
                emoji: "🌐"
            },
            {
                label: "VTC Partnership",
                description: "VTC partnership requests.",
                value: "partnership",
                emoji: "🤝"
            },
            {
                label: "Creator Support",
                description: "Creator support requests.",
                value: "creator",
                emoji: "🎨"
            }
        );

    return {
        embeds: [embed],
        components: [
            new ActionRowBuilder().addComponents(menu)
        ]
    };
}

module.exports = {
    createTicketPanel
};
