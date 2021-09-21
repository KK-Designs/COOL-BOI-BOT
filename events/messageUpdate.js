const {getLogChannel} = require('../utils.js');
const {MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const color = require('../color.json');
const db = require('quick.db');
/** @type {(...args: import("discord.js").ClientEvents["messageUpdate"]) => Promise<any>} */
module.exports = async (message, messageNew) => {
  if (!message.partial && message.content === messageNew.content)
    return;

  if (messageNew.partial)
    messageNew = await messageNew.fetch();

  if (messageNew.author.bot)
    return;

  const logChannel = getLogChannel(message.guild, db);

  if (!logChannel)
    return;

  const jumpToMsg = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setURL(`https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`)
        .setLabel('Jump to message')
        .setEmoji('⬆️')
        .setStyle('LINK')
    );
  const embed = new MessageEmbed()
    .setAuthor('📝 Message updated')
    .setColor(color.bot_theme)
    .setDescription(`${messageNew.author} edited a message in ${message.channel}`)
    .setFooter('COOL BOI BOT MESSAGE LOGGING')
    .setTimestamp();

  if (!message.partial && message.content)
    embed.addField('Old message:', `${message}`, true);

  if (messageNew.content)
    embed.addField('New message:', `${messageNew}`, true);

  const webhooks = await logChannel.fetchWebhooks();
  const webhook = webhooks.first();

  await webhook.send({
    username: 'COOL BOI BOT Logging',
    avatarURL: 'https://cdn.discordapp.com/avatars/811024409863258172/f67bc2b8f122599864b02156cd67564b.png',
    embeds: [embed],
    components: [jumpToMsg]
  });
};