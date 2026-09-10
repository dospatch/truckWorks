const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("slowmode")
        .setDescription("Configure the current channel's slowmode.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addIntegerOption(option =>
            option
                .setName("seconds")
                .setDescription("Slowmode delay in seconds. Use 0 to disable.")
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(21600)
        ),

    async execute(interaction) {
        const seconds = interaction.options.getInteger("seconds");

        await interaction.channel.setRateLimitPerUser(seconds);

        await interaction.reply(
            seconds === 0
                ? "🔓 Slowmode has been disabled."
                : `🐌 Slowmode set to **${seconds} seconds**.`
        );
    }
};