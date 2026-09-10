const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require("discord.js");

function createTicketControls(status = "open") {
    const isClosed = status === "closed";

    const row1 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("ticket_claim")
                .setLabel("Claim")
                .setEmoji("👤")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(isClosed),

            new ButtonBuilder()
                .setCustomId("ticket_unclaim")
                .setLabel("Unclaim")
                .setEmoji("🔓")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(isClosed),

            new ButtonBuilder()
                .setCustomId("ticket_close")
                .setLabel("Close")
                .setEmoji("🔒")
                .setStyle(ButtonStyle.Danger)
                .setDisabled(isClosed)
        );

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("ticket_reopen")
                .setLabel("Reopen")
                .setEmoji("🔓")
                .setStyle(ButtonStyle.Success)
                .setDisabled(!isClosed),

            new ButtonBuilder()
                .setCustomId("ticket_delete")
                .setLabel("Delete")
                .setEmoji("🗑️")
                .setStyle(ButtonStyle.Danger)
        );

    return [row1, row2];
}

function createTicketEmbed({
    ticketType,
    ticketNumber,
    user,
    subject,
    details,
    claimedBy,
    status = "open",
    closedBy = null,
    closeReason = null
}) {
    let statusText = "🟢 OPEN";

    if (status === "claimed") {
        statusText = "🟡 CLAIMED";
    }

    if (status === "closed") {
        statusText = "🔴 CLOSED";
    }

    const embed = new EmbedBuilder()
        .setTitle(`${ticketType.emoji} ${ticketType.label}`)
        .setDescription(
            "Welcome to your **TruckWorks Support Ticket**.\n\n" +
            "A member of the appropriate team will assist you as soon as possible."
        )
        .addFields(
            {
                name: "🎫 Ticket",
                value: `#${ticketNumber}`,
                inline: true
            },
            {
                name: "👤 Created By",
                value: `${user}`,
                inline: true
            },
            {
                name: "📌 Status",
                value: statusText,
                inline: true
            },
            {
                name: "📝 Subject",
                value: subject || "Not provided."
            },
            {
                name: "📄 Details",
                value: details || "No additional details provided."
            },
            {
                name: "👤 Claimed By",
                value: claimedBy || "Nobody"
            }
        );

    if (status === "closed") {
        embed.addFields(
            {
                name: "🔒 Closed By",
                value: closedBy || "Unknown",
                inline: true
            },
            {
                name: "📋 Close Reason",
                value: closeReason || "No reason provided."
            }
        );
    }

    return embed
        .setFooter({
            text: "TruckWorks • Ticket System"
        })
        .setTimestamp();
}

module.exports = {
    createTicketControls,
    createTicketEmbed
};
