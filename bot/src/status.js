const { EmbedBuilder, ChannelType } = require("discord.js");
const config = require("./config");

function buildStatusEmbed(client, guild, websiteUrl = config.websiteUrl) {
  const uptimeSeconds = Math.floor(process.uptime());
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = uptimeSeconds % 60;
  const uptime = hours ? hours + "h " + minutes + "m " + seconds + "s" : minutes ? minutes + "m " + seconds + "s" : seconds + "s";

  const textChannels = guild.channels.cache.filter((channel) => channel.type === ChannelType.GuildText).size;
  const voiceChannels = guild.channels.cache.filter((channel) => channel.type === ChannelType.GuildVoice).size;

  return new EmbedBuilder()
    .setTitle("🚛 BC TRUCK WORKS • Bot Status")
    .setDescription("The BC TRUCK WORKS Discord system is online and ready.")
    .setColor(0x2ecc71)
    .addFields(
      { name: "🤖 Bot", value: "🟢 Online", inline: true },
      { name: "🌐 Website", value: "[Open Dashboard](" + websiteUrl + ")", inline: true },
      { name: "🏢 Server", value: guild.name, inline: true },
      { name: "👥 Members", value: guild.memberCount.toLocaleString(), inline: true },
      { name: "📺 Text Channels", value: String(textChannels), inline: true },
      { name: "🎙️ Voice Channels", value: String(voiceChannels), inline: true },
      { name: "⏱️ Bot Uptime", value: uptime, inline: true },
      { name: "🚛 Platform", value: "ATS / ETS2", inline: true },
      { name: "📡 Telemetry", value: "Bridge ready", inline: true }
    )
    .setFooter({ text: "BC TRUCK WORKS • Discord Core" })
    .setTimestamp();
}

async function updateBotStatusChannel(client) {
  const guild = await client.guilds.fetch(config.guildId);
  const channel = guild.channels.cache.find(
    (item) => item.type === ChannelType.GuildText && item.name === "📊│bot-status"
  );

  if (!channel || !channel.isTextBased()) {
    console.warn('[STATUS] Channel "📊│bot-status" was not found. Run /setup first.');
    return;
  }

  const embed = buildStatusEmbed(client, guild, config.websiteUrl);
  const messages = await channel.messages.fetch({ limit: 25 });
  const existing = messages.find(
    (message) => message.author.id === client.user.id && message.embeds[0]?.title === "🚛 BC TRUCK WORKS • Bot Status"
  );

  if (existing) {
    await existing.edit({ embeds: [embed] });
    return existing;
  }

  const message = await channel.send({ embeds: [embed] });
  await message.pin().catch(() => null);
  return message;
}

module.exports = { buildStatusEmbed, updateBotStatusChannel };
