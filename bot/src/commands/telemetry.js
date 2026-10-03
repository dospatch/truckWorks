const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const config = require("../config");

module.exports = {
  data: new SlashCommandBuilder().setName("telemetry").setDescription("Show the BC TRUCK WORKS ATS/ETS2 telemetry setup guide."),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("📡 BC TRUCK WORKS • ATS / ETS2 TELEMETRY")
      .setDescription("Connect ATS/ETS2 telemetry to your BC TRUCK WORKS driver profile and dashboard.")
      .setColor(0x2ecc71)
      .addFields(
        { name: "1️⃣ Install on your gaming PC", value: "The telemetry provider and BC TRUCK WORKS Driver Agent belong on the same Windows PC where ATS/ETS2 is installed and played. They do not go inside Discord or on the BC TRUCK WORKS website.", inline: false },
        { name: "2️⃣ Telemetry source", value: "BC TRUCK WORKS currently expects the local telemetry endpoint:\n" + String.fromCharCode(96) + "http://127.0.0.1:25555/api/ets2/telemetry" + String.fromCharCode(96), inline: false },
        { name: "3️⃣ Start the game", value: "Launch ATS or ETS2 and load into your truck. The telemetry source must report the game as connected.", inline: false },
        { name: "4️⃣ Start BC TRUCK WORKS Agent", value: "Run the Driver Agent on the same gaming PC. It reads local telemetry and securely sends it to BC TRUCK WORKS.", inline: false },
        { name: "5️⃣ Verify", value: "[Open BC TRUCK WORKS Dashboard](" + config.websiteUrl + ") and open Live Telemetry. You should see LIVE when the simulator is connected.", inline: false },
        { name: "📊 Tracked data", value: "🚛 Truck • 💨 Speed • 📏 Distance/Miles • ⛽ Fuel • 🔧 Damage • 📦 Cargo • 🗺️ Route • 💰 Job data • 🕐 Trip data • 🏆 Driver history", inline: false },
        { name: "🆘 Help", value: "If it does not connect, use 📡│telemetry-help. Never post your Agent Token in Discord.", inline: false }
      )
      .setFooter({ text: "BC TRUCK WORKS • ATS / ETS2 Telemetry" })
      .setTimestamp();
    return interaction.reply({ embeds: [embed] });
  }
};