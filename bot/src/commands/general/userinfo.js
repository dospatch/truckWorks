const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("View information about a Discord member.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("The member to view.")
                .setRequired(false)
        ),

    async execute(interaction) {
        const user =
            interaction.options.getUser("user") ||
            interaction.user;

        const member =
            interaction.guild.members.cache.get(user.id);

        const embed = new EmbedBuilder()
            .setTitle(`👤 ${user.username}`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addFields(
                {
                    name: "🆔 User ID",
                    value: user.id,
                    inline: true
                },
                {
                    name: "🤖 Bot",
                    value: user.bot ? "Yes" : "No",
                    inline: true
                },
                {
                    name: "📅 Account Created",
                    value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`
                }
            )
            .setFooter({
                text: "TruckWorks • User Information"
            })
            .setTimestamp();

        if (member) {
            embed.addFields({
                name: "📥 Joined Server",
                value: member.joinedTimestamp
                    ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`
                    : "Unknown"
            });

            const roles = member.roles.cache
                .filter(role => role.id !== interaction.guild.id)
                .map(role => role.toString())
                .slice(0, 10);

            embed.addFields({
                name: "🎭 Roles",
                value: roles.length
                    ? roles.join(", ")
                    : "No roles"
            });
        }

        await interaction.reply({
            embeds: [embed]
        });
    }
};