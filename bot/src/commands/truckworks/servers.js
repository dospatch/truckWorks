const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("servers")
        .setDescription("View TruckWorks server network information."),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("🌐 TruckWorks Server Network")
            .setDescription(
                "TruckWorks server information will be displayed here as servers are added to the network."
            )
            .addFields(
                {
                    name: "🚛 American Truck Simulator",
                    value: "Server information not configured yet."
                },
                {
                    name: "🇪🇺 Euro Truck Simulator 2",
                    value: "Server information not configured yet."
                },
                {
                    name: "📡 Network Status",
                    value: "🟡 Configuration in progress"
                }
            )
            .setFooter({
                text: "TruckWorks • Server Network"
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });
    }
};
