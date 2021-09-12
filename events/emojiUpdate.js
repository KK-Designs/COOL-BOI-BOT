const {MessageEmbed} = require('discord.js');
const color = require("../color.json");
const db = require('quick.db');
/** @type {(...args: import("discord.js").ClientEvents["emojiUpdate"]) => Promise<any>} */
module.exports = async (oldemoji, newemoji) => {
  
  var modLogChannel = db.get('loggingchannel_' + newemoji.guild.id);
  var modLogChannel = newemoji.guild.channels.cache.get(modLogChannel);
  if (!modLogChannel)
    return;

  let embed = new MessageEmbed() // Create embed
    .setTitle("📝 Emoji Update") // Set embed title
    .setColor(color.bot_theme) // Set color in HEX
    .setDescription(`New Name: ${newemoji} ${newemoji.name}\n \nOld Name: ${oldemoji.name}\n \nID: ${newemoji.id}`)
    .addField("New Emoji URL", newemoji.url)
    .addField("Old Emoji URL", oldemoji.url)
    .setFooter(`COOL BOI BOT SERVER LOGGING`)
    .setTimestamp();
  
  return await modLogChannel.send({embeds: [embed]});

};