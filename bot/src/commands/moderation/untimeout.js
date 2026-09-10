const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("untimeout")
        .setDescription("Remove a member's timeout.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Member to untimeout.")
                .setRequired(true)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser("user");

        const member = await interaction.guild.members.fetch(user.id)
            .catch(() => null);

        if (!member) {
            return interaction.reply({
                content: "❌ That member is not in the server.",
                ephemeral: true
            });
        }

        if (!member.moderatable) {
            return interaction.reply({
                content: "❌ I cannot modify that member.",
                ephemeral: true
            });
        }

        await member.timeout(null, "Timeout removed by staff.");

        await interaction.reply(
            `🔓 The timeout has been removed from **${user.tag}**.`
        );
    }
};