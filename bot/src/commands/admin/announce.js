const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("announce")
        .setDescription("Send an official TruckWorks announcement.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(option =>
            option
                .setName("message")
                .setDescription("Announcement message.")
                .setRequired(true)
        ),

    async execute(interaction) {
        const message = interaction.options.getString("message");

        const embed = new EmbedBuilder()
            .setTitle("📢 TruckWorks Announcement")
            .setDescription(message)
            .setFooter({
                text: `Posted by ${interaction.user.tag}`
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });
    }
};