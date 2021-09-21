const {MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const color = require("../color.json");
const db = require('quick.db');
const {getLogChannel} = require('../utils.js');
/** @type {(...args: import("discord.js").ClientEvents["channelCreate"]) => Promise<any>} */
module.exports = async channel => {
  if (channel.type === 'DM')
    return;

  const logChannel = getLogChannel(channel.guild, db);

  if (!logChannel)
    return;

  const botPerms = logChannel.permissionsFor(channel.guild.me);

  if (!botPerms.has('VIEW_CHANNEL'))
    return;

  if (!botPerms.has('MANAGE_WEBHOOKS'))
    return;

  if (!botPerms.has('SEND_MESSAGES'))
    return;

  const jumpToChannel = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setURL(`https://discord.com/channels/${channel.guild.id}/${channel.id}`)
        .setLabel('Go to channel')
        .setEmoji('⬆️')
        .setStyle('LINK')
    );
  const embed = new MessageEmbed()
    .setAuthor('🔨 Channel created')
    .setColor(color.success)
    .setDescription(`Created channel ${channel}`)
    .setFooter('COOL BOI BOT SERVER LOGGING')
    .setTimestamp();
  const webhooks = logChannel.fetchWebhooks();
  const webhook = webhooks.first();

  await webhook.send({
    username: 'COOL BOI BOT Logging',
    avatarURL: 'https://cdn.discordapp.com/avatars/811024409863258172/f67bc2b8f122599864b02156cd67564b.png',
    embeds: [embed],
    components: [jumpToChannel]
  });
};