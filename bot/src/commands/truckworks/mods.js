const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mods")
        .setDescription("View TruckWorks supported mods."),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("🔧 TruckWorks Supported Mods")
            .setDescription(
                "TruckWorks mod information will be maintained here as supported mods are added."
            )
            .addFields(
                {
                    name: "🚛 American Truck Simulator",
                    value: "No mods have been configured yet."
                },
                {
                    name: "🇪🇺 Euro Truck Simulator 2",
                    value: "No mods have been configured yet."
                },
                {
                    name: "⚠️ Important",
                    value:
                        "Always verify that mods are compatible with the current game version before using them during TruckWorks events."
                }
            )
            .setFooter({
                text: "TruckWorks • Mod Information"
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });
    }
};
