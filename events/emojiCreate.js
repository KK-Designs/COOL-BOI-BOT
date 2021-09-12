const {MessageEmbed} = require('discord.js');
const color = require("../color.json");
const db = require('quick.db');
/** @type {(...args: import("discord.js").ClientEvents["emojiCreate"]) => Promise<any>} */
module.exports = async emoji => {
  const modLogChannelID = db.get('loggingchannel_' + emoji.guild.id);
  const modLogChannel = emoji.guild.channels.cache.get(modLogChannelID);

  if (!modLogChannel)
    return;

  let embed = new MessageEmbed()
    .setTitle("➕ Emoji Create")
    .setColor(color.bot_theme)
    .setDescription(`Name: ${emoji} ${emoji.name}\nID: ${emoji.id}`)
    .addField("Emoji URL", emoji.url)
    .setFooter(`COOL BOI BOT SERVER LOGGING`)
    .setTimestamp();
  return await modLogChannel.send({embeds: [embed]});

};