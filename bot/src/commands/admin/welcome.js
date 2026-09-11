const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const configStore = require('../../config/welcome');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('Build and manage the BC TRUCK WORKS welcome channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(s => s.setName('set-channel').setDescription('Set the welcome channel').addChannelOption(o => o.setName('channel').setDescription('Welcome channel').setRequired(true)))
    .addSubcommand(s => s.setName('set-title').setDescription('Set the welcome embed title').addStringOption(o => o.setName('title').setDescription('Embed title').setRequired(true).setMaxLength(256)))
    .addSubcommand(s => s.setName('set-message').setDescription('Set the welcome embed message').addStringOption(o => o.setName('message').setDescription('Use {user} for the member mention').setRequired(true).setMaxLength(4000)))
    .addSubcommand(s => s.setName('enable').setDescription('Enable automatic welcomes'))
    .addSubcommand(s => s.setName('disable').setDescription('Disable automatic welcomes'))
    .addSubcommand(s => s.setName('preview').setDescription('Preview the current welcome embed')),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    let config = configStore.load();
    if (sub === 'set-channel') config = configStore.update({ channelId: interaction.options.getChannel('channel').id, enabled: true });
    if (sub === 'set-title') config = configStore.update({ title: interaction.options.getString('title') });
    if (sub === 'set-message') config = configStore.update({ description: interaction.options.getString('message') });
    if (sub === 'enable') config = configStore.update({ enabled: true });
    if (sub === 'disable') config = configStore.update({ enabled: false });

    const description = String(config.description || '').replaceAll('{user}', `<@${interaction.user.id}>`);
    const embed = new EmbedBuilder().setColor(config.color).setTitle(config.title).setDescription(description).setFooter({ text: config.footer }).setTimestamp();

    if (sub === 'preview') return interaction.reply({ embeds: [embed], ephemeral: true });
    return interaction.reply({ content: `✅ Welcome settings updated.\nStatus: ${config.enabled ? '🟢 Enabled' : '🔴 Disabled'}\nChannel: ${config.channelId ? `<#${config.channelId}>` : 'Not configured'}`, embeds: [embed], ephemeral: true });
  }
};
