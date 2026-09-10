const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lock")
        .setDescription("Lock the current channel.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        const channel = interaction.channel;

        if (
            !channel ||
            !channel.permissionOverwrites
        ) {
            return interaction.reply({
                content: "❌ This channel cannot be locked.",
                ephemeral: true
            });
        }

        await channel.permissionOverwrites.edit(
            interaction.guild.roles.everyone,
            {
                SendMessages: false
            }
        );

        await interaction.reply(
            "🔒 This channel has been locked by staff."
        );
    }
};