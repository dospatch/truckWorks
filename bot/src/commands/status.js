const { SlashCommandBuilder } = require("discord.js");
const config = require("../config");
const { buildStatusEmbed } = require("../status");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("Show the current BC TRUCK WORKS bot and server status."),

  async execute(interaction) {
    if (!interaction.guild) {
      return interaction.reply({ content: "❌ Use this command inside the BC TRUCK WORKS Discord server.", ephemeral: true });
    }
    const embed = buildStatusEmbed(interaction.client, interaction.guild, config.websiteUrl);
    return interaction.reply({ embeds: [embed] });
  },
};
