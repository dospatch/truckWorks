const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

const {
    getWarnings
} = require("../../utils/moderation");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warnings")
        .setDescription("View a member's warnings.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Member to check.")
                .setRequired(true)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser("user");
        const userWarnings = getWarnings(user.id);

        if (!userWarnings.length) {
            return interaction.reply({
                content: `✅ **${user.tag}** has no warnings.`,
                ephemeral: true
            });
        }

        const description = userWarnings
            .map((warning, index) =>
                `**${index + 1}.** ${warning.reason}\n` +
                `Moderator: <@${warning.moderatorId}>\n` +
                `Date: <t:${Math.floor(warning.timestamp / 1000)}:F>`
            )
            .join("\n\n");

        const embed = new EmbedBuilder()
            .setTitle(`⚠️ Warnings — ${user.tag}`)
            .setDescription(description)
            .setThumbnail(user.displayAvatarURL())
            .setFooter({
                text: `Total warnings: ${userWarnings.length}`
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });
    }
};