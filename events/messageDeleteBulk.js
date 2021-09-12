const {MessageEmbed} = require('discord.js');
const db = require('quick.db');
const color = require("../color.json");
/** @type {(...args: import("discord.js").ClientEvents["messageDeleteBulk"]) => Promise<any>} */
module.exports = async messages => {
  if (messages.first().channel.name === 'server-logs')
    return;

  messages = messages.filter(m => !m.partial);
  if (!messages.size)
    return;

  const messageChannel = messages.first().channel.name;
  const logchannelID = db.get('loggingchannel_' + messages.first().guild.id);
  const logchannel = messages.first().guild.channels.cache.get(logchannelID);

  if (logchannel) {
    let messageArray = [...messages.values()];
    messageArray.slice(10, messageArray.length); // Slice removes all ements from the first number to the second number in an array. We use this to cut off the length of the array
    let stringedArray = messageArray.join("\n"); // We join the array using \n to separate the lines
    if (stringedArray.length > 2048) {
      stringedArray.slice(2048, stringedArray.length);
      stringedArray += "...";
    }
    const embed = new MessageEmbed()
      .setColor(color.bot_theme)
      .setAuthor(`Messages Purged in #${messageChannel}`)
      .setTitle(`Message Bulk delete by ${messages.first().author.tag} deleted ${messages.size - 1} messages`)
      .setDescription(`${stringedArray}`)
      .setFooter(`COOL BOI BOT MESSAGE LOGGING`)
      .setTimestamp();
       
    await logchannel.send({embeds: [embed]}).catch(console.error);
  }

};