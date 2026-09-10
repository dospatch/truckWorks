const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("vtc")
        .setDescription("View TruckWorks VTC information."),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("🚛 TruckWorks VTC")
            .setDescription(
                "Welcome to **TruckWorks VTC**!\n\n" +
                "TruckWorks is focused on creating an organized, friendly, and enjoyable trucking community."
            )
            .addFields(
                {
                    name: "🚚 Supported Games",
                    value: "American Truck Simulator\nEuro Truck Simulator 2",
                    inline: true
                },
                {
                    name: "👥 Community",
                    value: "Drivers • Convoys • Events",
                    inline: true
                },
                {
                    name: "📋 Requirements",
                    value:
                        "Follow TruckWorks rules\n" +
                        "Respect other drivers\n" +
                        "Participate when available"
                }
            )
            .setFooter({
                text: "TruckWorks • VTC Information"
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });
    }
};
