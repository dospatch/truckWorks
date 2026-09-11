const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType } = require('discord.js');
const { TYPES, load, set, clear } = require('../../services/embedChannelConfig');

const labels = {
  server_recruitment: '🚛 Server Recruitment',
  convoy: '🚦 Convoy Updates',
  vtc_recruitment: '👥 VTC Recruitment',
  changelog: '📋 Changelog',
  maintenance: '🔧 Maintenance',
  welcome: '👋 Welcome'
};

const choices = Object.entries(labels).map(([name, label]) => ({ name: label, value: name }));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed-config')
    .setDescription('Manage BC TRUCK WORKS automatic embed channels.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(sub => sub.setName('set').setDescription('Set one or more channels for an embed type.')
      .addStringOption(o => o.setName('type').setDescription('Embed type').setRequired(true).addChoices(...choices))
      .addChannelOption(o => o.setName('channel').setDescription('Channel to add').setRequired(true).addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)))
    .addSubcommand(sub => sub.setName('clear').setDescription('Disable and remove all channels for an embed type.')
      .addStringOption(o => o.setName('type').setDescription('Embed type').setRequired(true).addChoices(...choices)))
    .addSubcommand(sub => sub.setName('list').setDescription('Show all configured embed channels.')),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    if (sub === 'set') {
      const type = interaction.options.getString('type');
      const channel = interaction.options.getChannel('channel');
      const current = load()[type]?.channelIds || [];
      const result = set(type, [...current, channel.id], true);
      return interaction.reply({ content: `✅ **${labels[type]}** will now use ${channel} for automatic posts.\nConfigured channels: ${result.channelIds.map(id => `<#${id}>`).join(', ')}`, ephemeral: true });
    }
    if (sub === 'clear') {
      const type = interaction.options.getString('type');
      clear(type);
      return interaction.reply({ content: `🔴 **${labels[type]}** automatic posting is disabled and its configured channels were cleared.`, ephemeral: true });
    }
    const config = load();
    const embed = new EmbedBuilder().setColor(0x5865F2).setTitle('🚛 BC TRUCK WORKS • Embed Channel Manager').setDescription('Only channels listed below receive automatic embed posts. Blank/disabled types do not post anywhere.').setTimestamp();
    for (const type of TYPES) {
      const entry = config[type] || { enabled: false, channelIds: [] };
      embed.addFields({ name: labels[type], value: entry.enabled && entry.channelIds.length ? entry.channelIds.map(id => `<#${id}>`).join(', ') : '🔴 Disabled', inline: false });
    }
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
