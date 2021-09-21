const {MessageEmbed} = require('discord.js');
const db = require('quick.db');
const color = require("../color.json");
const {getLogChannel} = require('../utils.js');
/** @type {(...args: import("discord.js").ClientEvents["emojiUpdate"]) => Promise<any>} */
module.exports = async (oldemoji, newemoji) => {
  const logChannel = getLogChannel(newemoji.guild, db);

  if (!logChannel)
    return;

  const embed = new MessageEmbed() // Create embed
    .setTitle('📝 Emoji Update') // Set embed title
    .setColor(color.bot_theme) // Set color in HEX
    .setDescription(`New Name: ${newemoji} ${newemoji.name}\n \nOld Name: ${oldemoji.name}\n \nID: ${newemoji.id}`)
    .addField('New Emoji URL', newemoji.url)
    .addField('Old Emoji URL', oldemoji.url)
    .setFooter('COOL BOI BOT SERVER LOGGING')
    .setTimestamp();
  //modLogChannel.send({ embeds: [embed] }).catch(console.error);
  const webhooks = await logChannel.fetchWebhooks();
  const webhook = webhooks.first();

  await webhook.send({
    username: 'COOL BOI BOT Logging',
    avatarURL: 'https://cdn.discordapp.com/avatars/811024409863258172/f67bc2b8f122599864b02156cd67564b.png',
    embeds: [embed]
  });
};