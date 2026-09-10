const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Delete messages from the current channel.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("Number of messages to delete (1-100).")
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)
        ),

    async execute(interaction) {
        const amount = interaction.options.getInteger("amount");

        await interaction.deferReply({ ephemeral: true });

        const deleted = await interaction.channel.bulkDelete(
            amount,
            true
        );

        await interaction.editReply(
            `🧹 Successfully deleted **${deleted.size}** message(s).`
        );
    }
};