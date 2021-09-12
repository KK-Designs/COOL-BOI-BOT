const {MessageEmbed} = require('discord.js');
const color = require("../color.json");
const db = require('quick.db');
/** @type {(...args: import("discord.js").ClientEvents["messageUpdate"]) => Promise<any>} */
module.exports = async (message, messageNew) => {
  if (message.partial)
    return;

  if (message.content === messageNew.content)
    return;

  if (message.author.bot)
    return;

  const modLogChannelID = db.get('loggingchannel_' + message.guild.id);
  const modLogChannel = message.guild.channels.cache.get(modLogChannelID);

  if (!modLogChannel)
    return;

  const embed = new MessageEmbed()
    .setAuthor('📝 Message updated')
    .setColor(color.bot_theme)
    .setDescription(`${message.author} edited a message in ${message.channel}`)
    .addField('Old message:', `${message}`, true)
    .addField('New message:', `${messageNew}`, true)
    .setFooter(`COOL BOI BOT MESSAGE LOGGING`)
    .setTimestamp();

  await modLogChannel.send({embeds: [embed]});
};