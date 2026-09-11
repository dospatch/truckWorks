const { EmbedBuilder } = require('discord.js');
const { load } = require('../config/welcome');

async function sendWelcome(member) {
  const config = load();
  if (!config.enabled || !config.channelId) return false;
  const channel = await member.guild.channels.fetch(config.channelId).catch(() => null);
  if (!channel || !channel.isTextBased()) return false;
  const embed = new EmbedBuilder()
    .setColor(config.color || 0x5865F2)
    .setTitle(config.title)
    .setDescription(String(config.description || '').replaceAll('{user}', `<@${member.id}>`).replaceAll('{username}', member.user.username))
    .setFooter({ text: config.footer })
    .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
    .setTimestamp();
  await channel.send({ content: `<@${member.id}>`, embeds: [embed] });
  return true;
}

module.exports = { sendWelcome };
