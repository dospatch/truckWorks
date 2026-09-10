const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const {
    addWarning
} = require("../../utils/moderation");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Warn a member.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Member to warn.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for the warning.")
                .setRequired(true)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason");

        if (user.id === interaction.user.id) {
            return interaction.reply({
                content: "❌ You cannot warn yourself.",
                ephemeral: true
            });
        }

        const warnings = addWarning(
            user.id,
            interaction.user.id,
            reason
        );

        await interaction.reply(
            `⚠️ **${user.tag}** has been warned.\n` +
            `**Reason:** ${reason}\n` +
            `**Total warnings:** ${warnings.length}`
        );
    }
};