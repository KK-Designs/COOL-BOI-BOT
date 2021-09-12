const {MessageEmbed} = require('discord.js');
const color = require("../color.json");
const db = require('quick.db');
/** @type {(...args: import("discord.js").ClientEvents["channelUpdate"]) => Promise<any>} */
module.exports = async (oldchannel, newchannel) => {
  if (oldchannel.type === "DM" || oldchannel.name === newchannel.name)
    return;

  const modLogChannelID = db.get('loggingchannel_' + oldchannel.guild.id);
  const modLogChannel = oldchannel.guild.channels.cache.get(modLogChannelID);

  if (!modLogChannel)
    return;

  if (!modLogChannel.permissionsFor(newchannel.guild.me).has('VIEW_CHANNEL'))
    return;

  if (!modLogChannel.permissionsFor(newchannel.guild.me).has('SEND_MESSAGES'))
    return;

  const embed = new MessageEmbed()
    .setAuthor('📝 Channel updated')
    .setColor(color.bot_theme)
    .setDescription(`Channel Updated ${oldchannel}`)
    .addField(`Old channel:`, `${oldchannel.name}`, true)
    .addField(`New channel:`, `${newchannel.name}`, true)
    .setFooter(`COOL BOI BOT SERVER LOGGING`)
    .setTimestamp();

  await modLogChannel.send({embeds: [embed]});


};