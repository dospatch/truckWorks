const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Unban a Discord user.")
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption(option =>
            option
                .setName("userid")
                .setDescription("Discord user ID.")
                .setRequired(true)
        ),

    async execute(interaction) {
        const userId = interaction.options.getString("userid");

        if (!/^\d{17,20}$/.test(userId)) {
            return interaction.reply({
                content: "❌ Please provide a valid Discord user ID.",
                ephemeral: true
            });
        }

        try {
            await interaction.guild.members.unban(userId);

            await interaction.reply(
                `🔓 User **${userId}** has been unbanned.`
            );
        } catch {
            await interaction.reply({
                content: "❌ That user is not currently banned or the ID is invalid.",
                ephemeral: true
            });
        }
    }
};