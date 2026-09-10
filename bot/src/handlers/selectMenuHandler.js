const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    MessageFlags
} = require("discord.js");

const ticketConfig = require("../config/tickets");

async function handleSelectMenu(interaction) {
    if (interaction.customId !== "ticket_create") {
        return;
    }

    if (interaction.replied || interaction.deferred) {
        console.warn(
            "⚠️ Ticket select interaction was already acknowledged."
        );
        return;
    }

    const type = interaction.values?.[0];

    if (!type || !ticketConfig.ticketTypes[type]) {
        await interaction.reply({
            content: "❌ Invalid ticket category selected.",
            flags: MessageFlags.Ephemeral
        }).catch(() => {});

        return;
    }

    const ticketType = ticketConfig.ticketTypes[type];

    const modal = new ModalBuilder()
        .setCustomId(`ticket_modal_${type}`)
        .setTitle(`${ticketType.label} Ticket`);

    const subjectInput = new TextInputBuilder()
        .setCustomId("ticket_subject")
        .setLabel("Subject")
        .setPlaceholder(
            "Briefly describe what you need help with..."
        )
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMaxLength(100);

    const detailsInput = new TextInputBuilder()
        .setCustomId("ticket_details")
        .setLabel("Details")
        .setPlaceholder(
            "Please provide as much information as possible..."
        )
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(2000);

    modal.addComponents(
        new ActionRowBuilder()
            .addComponents(subjectInput),

        new ActionRowBuilder()
            .addComponents(detailsInput)
    );

    await interaction.showModal(modal);
}

module.exports = {
    handleSelectMenu
};
