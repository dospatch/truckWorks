const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require("discord.js");

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
          await interaction.guild.channels.create({
            name,
            type: ChannelType.GuildText,
            parent: category.id,
            reason: "BC TRUCK WORKS complete Discord rebuild",
          });
          channelsCreated++;
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
        `⚠️ Delete failures: ${failed}`,
        "",
        "🚛 The new BC TRUCK WORKS structure is ready.",
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