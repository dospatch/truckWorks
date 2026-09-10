const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unlock")
        .setDescription("Unlock the current channel.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        const channel = interaction.channel;

        if (
            !channel ||
            !channel.permissionOverwrites
        ) {
            return interaction.reply({
                content: "❌ This channel cannot be unlocked.",
                ephemeral: true
            });
        }

        await channel.permissionOverwrites.edit(
            interaction.guild.roles.everyone,
            {
                SendMessages: null
            }
        );

        await interaction.reply(
            "🔓 This channel has been unlocked."
        );
    }
};