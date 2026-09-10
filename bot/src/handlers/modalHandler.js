const {
    EmbedBuilder,
    MessageFlags
} = require("discord.js");

const {
    createTicket
} = require("../utils/ticketManager");

const {
    createTicketControls,
    createTicketEmbed
} = require("../utils/ticketControls");

const ticketConfig =
    require("../config/tickets");

async function handleModal(interaction) {
    if (
        !interaction.customId.startsWith("ticket_modal_")
    ) {
        return;
    }

    if (interaction.replied || interaction.deferred) {
        return;
    }

    /*
     * CLOSE REASON MODAL
     */
    if (
        interaction.customId ===
        "ticket_modal_close_reason"
    ) {
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        });

        const {
            getTicketInfo,
            updateTicketTopic
        } = require("../utils/ticketManager");

        const ticket =
            getTicketInfo(interaction.channel);

        if (!ticket) {
            return interaction.editReply({
                content:
                    "❌ This is not a valid TruckWorks ticket."
            });
        }

        if (ticket.status === "closed") {
            return interaction.editReply({
                content:
                    "ℹ️ This ticket is already closed."
            });
        }

        const reason =
            interaction.fields.getTextInputValue(
                "ticket_close_reason"
            );

        ticket.status = "closed";
        ticket.closedBy = interaction.user.id;
        ticket.closeReason =
            reason || "No reason provided.";

        await updateTicketTopic(
            interaction.channel,
            ticket
        );

        await interaction.channel.permissionOverwrites.edit(
            ticket.ownerId,
            {
                SendMessages: false
            }
        );

        await interaction.channel.setName(
            `closed-${ticket.ticketNumber}`
        );

        const ticketType =
            ticketConfig.ticketTypes[ticket.type];

        const embed =
            createTicketEmbed({
                ticketType,
                ticketNumber: ticket.ticketNumber,
                user: await interaction.guild.members
                    .fetch(ticket.ownerId)
                    .catch(() => ({
                        toString: () =>
                            `<@${ticket.ownerId}>`
                    })),
                subject: "Ticket",
                details:
                    "This ticket has been closed.",
                claimedBy: ticket.claimedBy
                    ? `<@${ticket.claimedBy}>`
                    : null,
                status: "closed",
                closedBy: interaction.user,
                closeReason: ticket.closeReason
            });

        await interaction.channel.send({
            embeds: [embed],
            components: createTicketControls("closed")
        });

        await interaction.editReply({
            content:
                "🔒 Ticket closed successfully."
        });

        console.log(
            `🔒 Ticket #${ticket.ticketNumber} closed by ${interaction.user.tag}`
        );

        return;
    }

    /*
     * NORMAL TICKET CREATION
     */

    const type =
        interaction.customId.replace(
            "ticket_modal_",
            ""
        );

    const ticketType =
        ticketConfig.ticketTypes[type];

    if (!ticketType) {
        await interaction.reply({
            content:
                "❌ This ticket category is no longer available.",
            flags: MessageFlags.Ephemeral
        }).catch(() => {});

        return;
    }

    const subject =
        interaction.fields.getTextInputValue(
            "ticket_subject"
        );

    const details =
        interaction.fields.getTextInputValue(
            "ticket_details"
        );

    console.log(
        `🎫 Modal received: ${interaction.customId} | ` +
        `User: ${interaction.user.tag}`
    );

    await interaction.deferReply({
        flags: MessageFlags.Ephemeral
    });

    try {
        console.log(
            `🎫 Creating ${type} ticket for ${interaction.user.tag}`
        );

        const result =
            await createTicket({
                guild: interaction.guild,
                user: interaction.user,
                type,
                subject,
                details
            });

        if (!result.success) {
            if (result.reason === "MAX_TICKETS") {
                const existingChannel =
                    result.channel;

                return interaction.editReply({
                    content:
                        existingChannel
                            ? `❌ You already have an open ticket: ${existingChannel}`
                            : "❌ You already have an open ticket. Please close your existing ticket before creating another one."
                });
            }

            if (
                result.reason ===
                "CATEGORY_NOT_FOUND"
            ) {
                return interaction.editReply({
                    content:
                        `❌ The ticket category **${result.categoryName}** could not be found. Please contact TruckWorks staff.`
                });
            }

            return interaction.editReply({
                content:
                    "❌ Your ticket could not be created."
            });
        }

        const ticketChannel =
            result.channel;

        const ticketEmbed =
            createTicketEmbed({
                ticketType: result.ticketType,
                ticketNumber: result.ticketNumber,
                user: interaction.user,
                subject,
                details,
                claimedBy: null,
                status: "open"
            });

        await ticketChannel.send({
            content: result.staffRole
                ? `${result.staffRole}`
                : "📢 TruckWorks staff have been notified.",

            embeds: [ticketEmbed],

            components:
                createTicketControls("open"),

            allowedMentions:
                result.staffRole
                    ? {
                        roles: [
                            result.staffRole.id
                        ]
                    }
                    : {
                        parse: []
                    }
        });

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("🎫 Ticket Created")
                    .setDescription(
                        `Your **${result.ticketType.label}** ticket has been created successfully.\n\n` +
                        `📌 Ticket: ${ticketChannel}\n` +
                        `🔢 Ticket Number: #${result.ticketNumber}\n\n` +
                        "A member of the appropriate TruckWorks team will assist you."
                    )
                    .setFooter({
                        text:
                            "TruckWorks • Support System"
                    })
                    .setTimestamp()
            ]
        });

        console.log(
            `✅ Created ticket #${result.ticketNumber} for ${interaction.user.tag}`
        );

    } catch (error) {
        console.error(
            "❌ Ticket creation error:",
            error
        );

        await interaction.editReply({
            content:
                "❌ An unexpected error occurred while creating your ticket. Please contact TruckWorks staff."
        }).catch(() => {});
    }
}

module.exports = {
    handleModal
};
