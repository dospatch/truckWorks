const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban a member from the server.")
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Member to ban.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for the ban.")
                .setRequired(false)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser("user");

        const reason =
            interaction.options.getString("reason") ||
            "No reason provided.";

        const member = await interaction.guild.members.fetch(user.id)
            .catch(() => null);

        if (member && !member.bannable) {
            return interaction.reply({
                content: "❌ I cannot ban that member. Check my role hierarchy.",
                ephemeral: true
            });
        }

        await interaction.guild.members.ban(user.id, {
            reason
        });

        await interaction.reply(
            `🔨 **${user.tag}** has been banned.\n**Reason:** ${reason}`
        );
    }
};