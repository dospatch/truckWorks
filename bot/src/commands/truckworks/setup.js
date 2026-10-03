const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require("discord.js");

const layout = [
  ["🚛 BC TRUCK WORKS • START HERE", ["📢│announcements","📌│server-info","📊│bot-status","💡│suggestions"]],
  ["💬 COMMUNITY", ["💬│general","🚛│truck-talk","📸│screenshots","🎥│streamers"]],
  ["🛣️ DRIVING • ATS / ETS2", ["🇺🇸│ats","🇪🇺│ets2","📡│telemetry","📏│miles-and-trips","⛽│fuel-and-rest","🧭│navigation"]],
  ["◎ CONVOYS", ["📅│convoy-events","🚦│convoy-lobby","📡│convoy-live","🗺️│convoy-routes","🏆│leaderboard"]],
  ["🏢 VTC • COMPANY", ["🏢│vtc","📋│dispatch","💰│earnings","📈│career","🧾│trip-reports"]],
  ["🆘 SUPPORT", ["🎫│support","🐛│bug-reports","📡│telemetry-help","💻│technical-help"]],
  ["🎙️ VOICE • DRIVERS", [["🚛│Truckers",true],["◎│Convoy 1",true],["◎│Convoy 2",true],["🎙️│Driver Lounge",true],["🔊│Dispatch",true]]],
  ["🔒 STAFF • TRUCK WORKS", ["🔒│staff-chat","📋│staff-logs","🚨│alerts","🛠️│development","🗃️│admin"]]
];

module.exports = {
  data: new SlashCommandBuilder().setName("truckworks-setup").setDescription("Build the complete BC TRUCK WORKS Discord layout.").setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    if (!interaction.guild) return interaction.reply({content:"❌ This command must be used in a server.",ephemeral:true});
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) return interaction.reply({content:"❌ Administrator permission is required.",ephemeral:true});
    await interaction.deferReply({ephemeral:true});
    const me = await interaction.guild.members.fetchMe();
    if (!me.permissions.has(PermissionFlagsBits.ManageChannels)) return interaction.editReply("❌ I need **Manage Channels** permission to build the TruckWorks layout.");
    const oldNames = new Set(layout.map(x => x[0]));
    let removed = 0;
    const oldCategories = [...interaction.guild.channels.cache.values()]
      .filter(channel => channel.type === ChannelType.GuildCategory && (oldNames.has(channel.name) || channel.name.includes("TRUCK WORKS")));

    for (const category of oldCategories) {
      for (const child of [...category.children.cache.values()]) {
        if (child.deletable) { await child.delete("BC TRUCK WORKS layout rebuild").catch(() => null); removed++; }
      }
      if (category.deletable) { await category.delete("BC TRUCK WORKS layout rebuild").catch(() => null); removed++; }
    }

    for (const channel of [...interaction.guild.channels.cache.values()]) {
      if (!channel.parentId && channel.name.includes("TRUCK WORKS") && channel.deletable) {
        await channel.delete("BC TRUCK WORKS layout rebuild").catch(() => null);
        removed++;
      }
    }
    let categories = 0, channels = 0;
    for (const item of layout) {
      const category = await interaction.guild.channels.create({name:item[0],type:ChannelType.GuildCategory,reason:"BC TRUCK WORKS layout setup"});
      categories++;
      for (const entry of item[1]) {
        const name = Array.isArray(entry) ? entry[0] : entry;
        const voice = Array.isArray(entry) && entry[1] === true;
        await interaction.guild.channels.create({name,type:voice ? ChannelType.GuildVoice : ChannelType.GuildText,parent:category.id,reason:"BC TRUCK WORKS layout setup"});
        channels++;
      }
    }
    await interaction.editReply("✅ **BC TRUCK WORKS Discord layout rebuilt.**

🗑️ Removed: " + removed + "
📁 Categories: " + categories + "
📺 Channels: " + channels + "

Run `/truckworks` after this to view the bot dashboard.");
  }
};