const {MessageEmbed} = require('discord.js');
const color = require("../color.json");
const db = require('quick.db');
/** @type {(...args: import("discord.js").ClientEvents["channelCreate"]) => Promise<any>} */
module.exports = async channel => {
  if (channel.type === "DM")
    return;

  const modLogChannelID = db.get('loggingchannel_' + channel.guild.id);
  const modLogChannel = channel.guild.channels.cache.get(modLogChannelID);

  if (!modLogChannel)
    return;


  if (!modLogChannel.permissionsFor(channel.guild.me).has('VIEW_CHANNEL'))
    return;

  if (!modLogChannel.permissionsFor(channel.guild.me).has('SEND_MESSAGES'))
    return;

  const embed = new MessageEmbed()
    .setAuthor('🔨 Channel created')
    .setColor(color.success)
    .setDescription(`Created channel ${channel}`)
    .setFooter(`COOL BOI BOT SERVER LOGGING`)
    .setTimestamp();

  return await modLogChannel.send({embeds: [embed]});


};