const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
} = require("discord.js");

const layout = [
  {
    name: "🚛 BC TRUCK WORKS • START HERE",
    channels: ["📢│announcements", "📌│server-info", "📊│bot-status", "💡│suggestions"],
  },
  {
    name: "💬 COMMUNITY",
    channels: ["💬│general", "🚛│truck-talk", "📸│screenshots", "🎥│streamers"],
  },
  {
    name: "🛣️ DRIVING • ATS / ETS2",
    channels: ["🇺🇸│ats", "🇪🇺│ets2", "📡│telemetry", "📏│miles-and-trips", "⛽│fuel-and-rest", "🧭│navigation"],
  },
  {
    name: "◎ CONVOYS",
    channels: ["📅│convoy-events", "🚦│convoy-lobby", "📡│convoy-live", "🗺️│convoy-routes", "🏆│leaderboard"],
  },
  {
    name: "🏢 VTC • COMPANY",
    channels: ["🏢│vtc", "📋│dispatch", "💰│earnings", "📈│career", "🧾│trip-reports"],
  },
  {
    name: "🆘 SUPPORT",
    channels: ["🎫│support", "🐛│bug-reports", "📡│telemetry-help", "💻│technical-help"],
  },
  {
    name: "🎙️ VOICE • DRIVERS",
    voice: ["🚛│Truckers", "◎│Convoy 1", "◎│Convoy 2", "🎙️│Driver Lounge", "🔊│Dispatch"],
  },
  {
    name: "🔒 STAFF • TRUCK WORKS",
    channels: ["🔒│staff-chat", "📋│staff-logs", "🚨│alerts", "🛠️│development", "🗃️│admin"],
  },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Create the BC TRUCK WORKS Discord layout.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    if (!interaction.guild) {
      return interaction.reply({
        content: "❌ Use this command inside the BC TRUCK WORKS Discord server.",
        ephemeral: true,
      });
    }

    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        content: "❌ Administrator permission is required.",
        ephemeral: true,
      });
    }

    await interaction.deferReply({ ephemeral: true });

    const me = await interaction.guild.members.fetchMe();

    if (!me.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return interaction.editReply(
        "❌ I need the **Manage Channels** permission before I can build the server."
      );
    }

    let removed = 0;
    let categoriesCreated = 0;
    let channelsCreated = 0;

    const managedCategoryNames = new Set(layout.map((item) => item.name));

    const oldCategories = [...interaction.guild.channels.cache.values()].filter(
      (channel) =>
        channel.type === ChannelType.GuildCategory &&
        (managedCategoryNames.has(channel.name) ||
          channel.name.toLowerCase().includes("truck works") ||
          channel.name.toLowerCase().includes("truckworks"))
    );

    for (const category of oldCategories) {
      const children = [...category.children.cache.values()];

      for (const child of children) {
        if (child.deletable) {
          await child
            .delete("BC TRUCK WORKS fresh server setup")
            .catch(() => null);
          removed++;
        }
      }

      if (category.deletable) {
        await category
          .delete("BC TRUCK WORKS fresh server setup")
          .catch(() => null);
        removed++;
      }
    }

    const existingTopLevelTruckChannels = [
      ...interaction.guild.channels.cache.values(),
    ].filter(
      (channel) =>
        !channel.parentId &&
        (channel.name.toLowerCase().includes("truck works") ||
          channel.name.toLowerCase().includes("truckworks")) &&
        channel.deletable
    );

    for (const channel of existingTopLevelTruckChannels) {
      await channel
        .delete("BC TRUCK WORKS fresh server setup")
        .catch(() => null);
      removed++;
    }

    for (const section of layout) {
      const category = await interaction.guild.channels.create({
        name: section.name,
        type: ChannelType.GuildCategory,
        reason: "BC TRUCK WORKS fresh server setup",
      });

      categoriesCreated++;

      for (const channelName of section.channels || []) {
        await interaction.guild.channels.create({
          name: channelName,
          type: ChannelType.GuildText,
          parent: category.id,
          reason: "BC TRUCK WORKS fresh server setup",
        });

        channelsCreated++;
      }

      for (const channelName of section.voice || []) {
        await interaction.guild.channels.create({
          name: channelName,
          type: ChannelType.GuildVoice,
          parent: category.id,
          reason: "BC TRUCK WORKS fresh server setup",
        });

        channelsCreated++;
      }
    }

    return interaction.editReply(
      [
        "✅ **BC TRUCK WORKS setup complete!**",
        "",
        `🗑️ Removed: ${removed}`,
        `📁 Categories created: ${categoriesCreated}`,
        `📺 Channels created: ${channelsCreated}`,
        "",
        "Your new BC TRUCK WORKS Discord layout is ready.",
      ].join("\\n")
    );
  },
};
