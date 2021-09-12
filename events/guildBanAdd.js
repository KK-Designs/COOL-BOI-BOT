const {MessageEmbed} = require('discord.js');
const color = require("../color.json");
const db = require('quick.db');
/** @type {(...args: import("discord.js").ClientEvents["guildBanAdd"]) => Promise<any>} */
module.exports = async (ban) => {
  
  const modLogChannelID = db.get('loggingchannel_' + ban.guild.id);
  const modLogChannel = ban.guild.channels.cache.get(modLogChannelID);

  if (!modLogChannel)
    return;

  const embed = new MessageEmbed()
    .setTitle("🔒 Member ban")
    .setColor(color.bot_theme)
    .setDescription(`Name: ${ban.user.username}\n \nID: ${ban.user.id}`)
    .setFooter(`COOL BOI BOT MEMBER LOGGING`);

  return await modLogChannel.send({embeds: [embed]});

};