const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const config = require("../config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("truckworks")
    .setDescription("Open the BC TRUCK WORKS driver hub."),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("🚛 BC TRUCK WORKS")
      .setDescription("Your ATS / ETS2 trucking hub.")
      .setColor(0x2ecc71)
      .addFields(
        { name: "📡 Live Telemetry", value: "Connect your local SCS telemetry bridge to track your truck.", inline: false },
        { name: "🛣️ Driving", value: "ATS and ETS2 tracking, miles, trips, fuel, rest and navigation.", inline: true },
        { name: "◎ Convoys", value: "Convoy events, routes, live drivers and leaderboards.", inline: true },
        { name: "🏢 VTC", value: "Dispatch, earnings, career history and trip reports.", inline: true },
        { name: "🌐 Website", value: "[Open BC TRUCK WORKS](${config.websiteUrl})", inline: false }
      )
      .setFooter({ text: "BC TRUCK WORKS • ATS / ETS2" })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
