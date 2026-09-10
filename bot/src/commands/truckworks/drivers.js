const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("drivers")
        .setDescription("View TruckWorks drivers."),

    async execute(interaction) {
        const guild = interaction.guild;

        const driverRole = guild.roles.cache.find(role =>
            ["driver", "truckworks driver", "vtc driver"]
                .includes(role.name.toLowerCase())
        );

        if (!driverRole) {
            return interaction.reply({
                content:
                    "🚛 The TruckWorks Driver role has not been configured yet.",
                ephemeral: true
            });
        }

        const drivers = guild.members.cache
            .filter(member => member.roles.cache.has(driverRole.id))
            .map(member => `• ${member}`)
            .slice(0, 25);

        const embed = new EmbedBuilder()
            .setTitle("🚛 TruckWorks Drivers")
            .setDescription(
                drivers.length
                    ? drivers.join("\n")
                    : "No drivers are currently assigned."
            )
            .addFields({
                name: "👥 Driver Count",
                value: `${drivers.length}`,
                inline: true
            })
            .setFooter({
                text: "TruckWorks • Driver Roster"
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });
    }
};
