const {
    PermissionFlagsBits,
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    MessageFlags
} = require("discord.js");

const ticketConfig =
    require("../config/tickets");

const {
    getTicketInfo,
    updateTicketTopic,
    resolveTicketChannel
} = require("../utils/ticketManager");

const {
    createTicketControls
} = require("../utils/ticketControls");

const staffApplicationManager = require("../utils/staffApplicationManager");

function isStaff(interaction, ticketType) {
    if (
        interaction.member.permissions.has(
            PermissionFlagsBits.Administrator
        )
    ) {
        return true;
    }

    const configured =
        ticketConfig.ticketTypes[ticketType];

    if (!configured) {
        return false;
    }

    const staffRoleName =
        configured.staffRole
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "");

    return interaction.member.roles.cache.some(role => {
        const roleName =
            role.name
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "");

        return (
            roleName === staffRoleName ||
            roleName.endsWith(staffRoleName) ||
            staffRoleName.endsWith(roleName)
        );
    });
}

async function refreshTicketMessage(channel) {
    const messages =
        await channel.messages.fetch({
            limit: 20
        });

    const botMessages =
        messages.filter(
            message =>
                message.author.id ===
                channel.client.user.id &&
                message.embeds.length > 0
        );

    const mainMessage =
        botMessages.last();

    if (!mainMessage) {
        return;
    }

    const ticket =
        getTicketInfo(channel);

    if (!ticket) {
        return;
    }

    const type =
        ticketConfig.ticketTypes[ticket.type];

    if (!type) {
        return;
    }

    const embed =
        EmbedBuilder.from(
            mainMessage.embeds[0]
        );

    const fields =
        embed.data.fields || [];

    const statusIndex =
        fields.findIndex(
            field =>
                field.name === "📌 Status"
        );

    const claimIndex =
        fields.findIndex(
            field =>
                field.name === "👤 Claimed By"
        );

    const closedByIndex =
        fields.findIndex(
            field =>
                field.name === "🔒 Closed By"
        );

    const reasonIndex =
        fields.findIndex(
            field =>
                field.name === "📋 Close Reason"
        );

    let statusText = "🟢 OPEN";

    if (ticket.status === "closed") {
        statusText = "🔴 CLOSED";
    } else if (ticket.claimedBy) {
        statusText = "🟡 CLAIMED";
    }

    if (statusIndex >= 0) {
        fields[statusIndex].value =
            statusText;
    }

    if (claimIndex >= 0) {
        fields[claimIndex].value =
            ticket.claimedBy
                ? `<@${ticket.claimedBy}>`
                : "Nobody";
    }

    if (
        ticket.status === "closed"
    ) {
        if (closedByIndex >= 0) {
            fields[closedByIndex].value =
                ticket.closedBy
                    ? `<@${ticket.closedBy}>`
                    : "Unknown";
        }

        if (reasonIndex >= 0) {
            fields[reasonIndex].value =
                ticket.closeReason ||
                "No reason provided.";
        }
    }

    embed.setFields(fields);

    await mainMessage.edit({
        embeds: [embed],
        components:
            createTicketControls(
                ticket.status === "closed"
                    ? "closed"
                    : "open"
            )
    }).catch(() => {});
}

async function handleButton(interaction) {
    if (!interaction.isButton()) {
        return false;
    }

    /*
     * STAFF APPLICATION BUTTONS
     *
     * These are handled before the ticket button
     * validation so they do not interfere with
     * the existing ticket system.
     */
    if (
        interaction.customId.startsWith(
            "staff_application_"
        )
    ) {
        return staffApplicationManager.handleButton(
            interaction
        );
    }

    if (
        !interaction.customId.startsWith(
            "ticket_"
        )
    ) {
        return false;
    }

    const ticket =
        getTicketInfo(
            interaction.channel
        );

    if (!ticket) {
        await interaction.reply({
            content:
                "❌ This channel is not a valid TruckWorks ticket.",
            flags: MessageFlags.Ephemeral
        });

        return true;
    }

    if (
        !isStaff(
            interaction,
            ticket.type
        )
    ) {
        await interaction.reply({
            content:
                "❌ You do not have permission to manage this ticket.",
            flags: MessageFlags.Ephemeral
        });

        return true;
    }

    /*
     * CLAIM
     */
    if (
        interaction.customId ===
        "ticket_claim"
    ) {
        if (ticket.status === "closed") {
            return interaction.reply({
                content:
                    "❌ Closed tickets cannot be claimed.",
                flags: MessageFlags.Ephemeral
            });
        }

        if (ticket.claimedBy) {
            return interaction.reply({
                content:
                    `❌ This ticket is already claimed by <@${ticket.claimedBy}>.`,
                flags: MessageFlags.Ephemeral
            });
        }

        /*
         * Acknowledge immediately.
         */
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        });

        try {
            const freshChannel =
                await resolveTicketChannel(
                    interaction.channel
                );

            if (!freshChannel) {
                return interaction.editReply({
                    content:
                        "❌ This ticket channel no longer exists. The ticket may have already been deleted."
                });
            }

            ticket.claimedBy =
                interaction.user.id;

            ticket.status = "claimed";

            await updateTicketTopic(
                freshChannel,
                ticket
            );

            await refreshTicketMessage(
                freshChannel
            );

            await interaction.editReply({
                content:
                    `👤 You have claimed **Ticket #${ticket.ticketNumber}**.`
            });

            console.log(
                `👤 Ticket #${ticket.ticketNumber} claimed by ${interaction.user.tag}`
            );

        } catch (error) {
            console.error(
                "❌ Ticket claim error:",
                error
            );

            if (
                error?.message ===
                "TICKET_CHANNEL_NOT_FOUND"
            ) {
                return interaction.editReply({
                    content:
                        "❌ This ticket channel no longer exists."
                }).catch(() => {});
            }

            await interaction.editReply({
                content:
                    "❌ The ticket could not be claimed because Discord returned an error. Please try again."
            }).catch(() => {});
        }

        return true;
    }

    /*
     * UNCLAIM
     */
    if (
        interaction.customId ===
        "ticket_unclaim"
    ) {
        if (!ticket.claimedBy) {
            return interaction.reply({
                content:
                    "ℹ️ This ticket is not currently claimed.",
                flags: MessageFlags.Ephemeral
            });
        }

        if (
            ticket.claimedBy !==
                interaction.user.id &&
            !interaction.member.permissions.has(
                PermissionFlagsBits.Administrator
            )
        ) {
            return interaction.reply({
                content:
                    "❌ Only the staff member who claimed this ticket or an administrator can unclaim it.",
                flags: MessageFlags.Ephemeral
            });
        }

        /*
         * Acknowledge immediately.
         */
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        });

        try {
            const freshChannel =
                await resolveTicketChannel(
                    interaction.channel
                );

            if (!freshChannel) {
                return interaction.editReply({
                    content:
                        "❌ This ticket channel no longer exists. The ticket may have already been deleted."
                });
            }

            ticket.claimedBy = null;
            ticket.status = "open";

            await updateTicketTopic(
                freshChannel,
                ticket
            );

            await refreshTicketMessage(
                freshChannel
            );

            await interaction.editReply({
                content:
                    `🔓 You have unclaimed **Ticket #${ticket.ticketNumber}**.`
            });

            console.log(
                `🔓 Ticket #${ticket.ticketNumber} unclaimed by ${interaction.user.tag}`
            );

        } catch (error) {
            console.error(
                "❌ Ticket unclaim error:",
                error
            );

            if (
                error?.message ===
                "TICKET_CHANNEL_NOT_FOUND"
            ) {
                return interaction.editReply({
                    content:
                        "❌ This ticket channel no longer exists."
                }).catch(() => {});
            }

            await interaction.editReply({
                content:
                    "❌ The ticket could not be unclaimed because Discord returned an error. Please try again."
            }).catch(() => {});
        }

        return true;
    }

    /*
     * CLOSE
     */
    if (
        interaction.customId ===
        "ticket_close"
    ) {
        if (ticket.status === "closed") {
            return interaction.reply({
                content:
                    "ℹ️ This ticket is already closed.",
                flags: MessageFlags.Ephemeral
            });
        }

        const modal =
            new ModalBuilder()
                .setCustomId(
                    "ticket_modal_close_reason"
                )
                .setTitle(
                    `Close Ticket #${ticket.ticketNumber}`
                );

        const reason =
            new TextInputBuilder()
                .setCustomId(
                    "ticket_close_reason"
                )
                .setLabel(
                    "Why are you closing this ticket?"
                )
                .setStyle(
                    TextInputStyle.Paragraph
                )
                .setPlaceholder(
                    "Enter the reason for closing this ticket..."
                )
                .setRequired(true)
                .setMaxLength(1000);

        modal.addComponents(
            new ActionRowBuilder()
                .addComponents(reason)
        );

        await interaction.showModal(
            modal
        );

        return true;
    }

    /*
     * REOPEN
     */
    if (
        interaction.customId ===
        "ticket_reopen"
    ) {
        if (ticket.status !== "closed") {
            return interaction.reply({
                content:
                    "ℹ️ This ticket is already open.",
                flags: MessageFlags.Ephemeral
            });
        }

        ticket.status = "open";
        ticket.closedBy = null;
        ticket.closeReason = null;

        await updateTicketTopic(
            interaction.channel,
            ticket
        );

        await interaction.channel.permissionOverwrites.edit(
            ticket.ownerId,
            {
                SendMessages: true
            }
        );

        await interaction.channel.setName(
            `ticket-${ticket.ticketNumber}`
        );

        await refreshTicketMessage(
            interaction.channel
        );

        await interaction.reply(
            `🔓 ${interaction.user} reopened **Ticket #${ticket.ticketNumber}**.`
        );

        return true;
    }

    /*
     * DELETE
     */
    if (
        interaction.customId ===
        "ticket_delete"
    ) {
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(
                        "🗑️ Ticket Deletion Scheduled"
                    )
                    .setDescription(
                        `This ticket will be permanently deleted in **${ticketConfig.settings.deleteDelay / 1000} seconds**.\n\n` +
                        "Any available transcript will be logged before deletion."
                    )
                    .setFooter({
                        text:
                            `TruckWorks • Ticket #${ticket.ticketNumber}`
                    })
                    .setTimestamp()
            ]
        });

        setTimeout(async () => {
            await interaction.channel.delete(
                `TruckWorks ticket #${ticket.ticketNumber} deleted by ${interaction.user.tag}.`
            ).catch(() => {});
        }, ticketConfig.settings.deleteDelay);

        return true;
    }

    return true;
}

module.exports = {
    handleButton
};
