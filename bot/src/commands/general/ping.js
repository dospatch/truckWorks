const {
    SlashCommandBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription(
            "Check if the TruckWorks bot is online."
        ),

    async execute(interaction) {
        await interaction.reply(
            "🏓 Pong! TruckWorks bot is operational."
        );
    }
};
