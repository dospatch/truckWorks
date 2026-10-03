const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require("discord.js");

const starterMessages = {
  "📢│announcements": "## 🚛 BC TRUCK WORKS\n\nWelcome to BC TRUCK WORKS — your ATS / ETS2 driving community.\n\nUse this server for driving, convoys, telemetry, VTC activity, trip tracking, support, and community events.",
  "📌│server-info": "## 📌 BC TRUCK WORKS • SERVER INFO\n\n🎮 ATS + ETS2\n📊 Telemetry, trips, miles, fuel, cargo, routes and driver history\n🌐 Dashboard: https://truck-works.vercel.app\n\nUse `/truckworks` for BC TRUCK WORKS info, `/telemetry` for telemetry setup, and `/status` for bot status.",
  "📡│telemetry": "## 📡 BC TRUCK WORKS TELEMETRY\n\n### 🚛 Automatic ATS / ETS2 Tracking\n\nInstall a compatible ATS/ETS2 telemetry provider on the same Windows PC where you play.\n\nBC TRUCK WORKS currently expects:\n`http://127.0.0.1:25555/api/ets2/telemetry`\n\nThen start ATS/ETS2, load into your truck, and start the BC TRUCK WORKS Driver Agent.\n\nTracked data can include truck, speed, miles, fuel, damage, cargo, route, jobs, trip time and driver history.\n\n⚠️ Never post your Agent Token in Discord.\n\n🆘 Need help? Use 📡│telemetry-help.",
  "📡│telemetry-help": "## 🆘 BC TRUCK WORKS TELEMETRY HELP\n\n**Game:** ATS / ETS2\n**Telemetry Provider:**\n**Game Running:** Yes / No\n**Telemetry Running:** Yes / No\n**Dashboard:** LIVE / WAITING / ERROR\n**Agent:** Running / Not Running\n**Error:**\n\n### 🔧 Common fixes\n• Start the telemetry provider.\n• Start ATS/ETS2 and load into the game.\n• Check the local telemetry endpoint.\n• Make sure the BC TRUCK WORKS Agent is running.\n• Check the API URL and Agent Token.\n\n⚠️ Never post your Agent Token."
};

async function seedChannel(channel) {
  const message = starterMessages[channel.name];
  if (!message || !channel?.isTextBased()) return false;
  try {
    await channel.send({ content: message });
    return true;
  } catch (error) {
    console.error("[SETUP] Starter message failed:", channel.name, error.message);
    return false;
  }
}

const layout = [
  { name: "🚛 BC TRUCK WORKS • START HERE", channels: ["📢│announcements", "📌│server-info", "📊│bot-status", "💡│suggestions"] },
  { name: "💬 COMMUNITY", channels: ["💬│general", "🚛│truck-talk", "📸│screenshots", "🎥│streamers"] },
  { name: "🛣️ DRIVING • ATS / ETS2", channels: ["🇺🇸│ats", "🇪🇺│ets2", "📡│telemetry", "📏│miles-and-trips", "⛽│fuel-and-rest", "🧭│navigation"] },
  { name: "◎ CONVOYS", channels: ["📅│convoy-events", "🚦│convoy-lobby", "📡│convoy-live", "🗺️│convoy-routes", "🏆│leaderboard"] },
  { name: "🏢 VTC • COMPANY", channels: ["🏢│vtc", "📋│dispatch", "💰│earnings", "📈│career", "🧾│trip-reports"] },
  { name: "🆘 SUPPORT", channels: ["🎫│support", "🐛│bug-reports", "📡│telemetry-help", "💻│technical-help"] },
  { name: "🎙️ VOICE • DRIVERS", voice: ["🚛│Truckers", "◎│Convoy 1", "◎│Convoy 2", "🎙️│Driver Lounge", "🔊│Dispatch"] },
  { name: "🔒 STAFF • TRUCK WORKS", channels: ["🔒│staff-chat", "📋│staff-logs", "🚨│alerts", "🛠️│development", "🗃️│admin"] },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Wipe channels and rebuild BC TRUCK WORKS.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    try {
      if (!interaction.guild) {
        return interaction.reply({ content: "❌ Use this command inside the BC TRUCK WORKS server.", ephemeral: true });
      }

      if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
        return interaction.reply({ content: "❌ Administrator permission is required.", ephemeral: true });
      }

      await interaction.deferReply({ ephemeral: true });

      const me = await interaction.guild.members.fetchMe();
      if (!me.permissions.has(PermissionFlagsBits.ManageChannels)) {
        return interaction.editReply("❌ I need **Manage Channels** permission to rebuild the server.");
      }

      let removed = 0;
      let failed = 0;
      let categoriesCreated = 0;
      let channelsCreated = 0;
      let messagesSeeded = 0;

      // Delete every channel the bot is allowed to delete.
      for (const channel of [...interaction.guild.channels.cache.values()]) {
        if (!channel.deletable) continue;

        try {
          await channel.delete("BC TRUCK WORKS complete channel rebuild");
          removed++;
        } catch (error) {
          failed++;
          console.error("[SETUP] Delete failed:", channel.name, error.message);
        }
      }

      // Rebuild the complete BC TRUCK WORKS structure.
      for (const section of layout) {
        const category = await interaction.guild.channels.create({
          name: section.name,
          type: ChannelType.GuildCategory,
          reason: "BC TRUCK WORKS complete Discord rebuild",
        });

        categoriesCreated++;

        for (const name of section.channels || []) {
          const channel = await interaction.guild.channels.create({
            name,
            type: ChannelType.GuildText,
            parent: category.id,
            reason: "BC TRUCK WORKS complete Discord rebuild",
          });
          channelsCreated++;
          if (await seedChannel(channel)) messagesSeeded++;
        }

        for (const name of section.voice || []) {
          await interaction.guild.channels.create({
            name,
            type: ChannelType.GuildVoice,
            parent: category.id,
            reason: "BC TRUCK WORKS complete Discord rebuild",
          });
          channelsCreated++;
        }
      }

      await interaction.editReply([
        "✅ **BC TRUCK WORKS Discord rebuilt!**",
        "",
        `🗑️ Removed: ${removed}`,
        `📁 Categories created: ${categoriesCreated}`,
        `📺 Channels created: ${channelsCreated}`,
        `📌 Starter messages added: ${messagesSeeded}`,
        `⚠️ Delete failures: ${failed}`,
        "",
        "🚛 The new BC TRUCK WORKS structure and starter information are ready.",
        "",
        "📡 Telemetry setup was included automatically — no separate channel-message setup is needed.",
      ].join("\n"));
    } catch (error) {
      console.error("[SETUP] Fatal error:", error);

      const message = error?.message || "Unknown setup error.";

      try {
        if (interaction.deferred || interaction.replied) {
          await interaction.editReply(`❌ **Setup failed.**\n\n${message}`);
        } else {
          await interaction.reply({ content: `❌ **Setup failed.**\n\n${message}`, ephemeral: true });
        }
      } catch (replyError) {
        console.error("[SETUP] Could not send error response:", replyError);
      }
    }
  },
};