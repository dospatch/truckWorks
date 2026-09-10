const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("driver")
        .setDescription("View information about a TruckWorks driver.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Driver to view.")
                .setRequired(true)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser("user");

        const member = await interaction.guild.members
            .fetch(user.id)
            .catch(() => null);

        if (!member) {
            return interaction.reply({
                content: "❌ That user is not a member of this server.",
                ephemeral: true
            });
        }

        const driverRole = interaction.guild.roles.cache.find(role =>
            ["driver", "truckworks driver", "vtc driver"]
                .includes(role.name.toLowerCase())
        );

        const isDriver = driverRole
            ? member.roles.cache.has(driverRole.id)
            : false;

        const embed = new EmbedBuilder()
            .setTitle(`🚛 Driver Profile — ${user.username}`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addFields(
                {
                    name: "👤 User",
                    value: `${user}`,
                    inline: true
                },
                {
                    name: "🚛 Driver Status",
                    value: isDriver ? "✅ Active Driver" : "❌ Not Assigned",
                    inline: true
                },
                {
                    name: "📅 Joined TruckWorks",
                    value: member.joinedTimestamp
                        ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>`
                        : "Unknown"
                }
            )
            .setFooter({
                text: "TruckWorks • Driver Profile"
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });
    }
};
