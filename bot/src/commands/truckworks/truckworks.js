const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const config = require("../../config");
const discordInvite = "https://discord.gg/DFQvShHj2T";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("truckworks")
    .setDescription("Show BC TRUCK WORKS status and links."),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("🚛 BC TRUCK WORKS")
      .setDescription("ATS / ETS2 companion, driver tracking, convoys and VTC tools.")
      .addFields(
        { name: "🤖 Bot", value: "🟢 Online", inline: true },
        { name: "📡 Commands", value: String(interaction.client.commands.size), inline: true },
        { name: "🌐 Dashboard", value: config.websiteUrl, inline: false },
        { name: "💬 Discord", value: discordInvite, inline: false },
        { name: "🚛 Games", value: "American Truck Simulator\nEuro Truck Simulator 2", inline: true },
        { name: "◎ Convoys", value: "Use /convoy for scheduled convoy events.", inline: true }
      )
      .setFooter({ text: "BC TRUCK WORKS • Driver Command Center" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
