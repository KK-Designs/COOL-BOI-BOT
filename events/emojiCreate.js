const {MessageEmbed} = require('discord.js');
const db = require('quick.db');
const color = require("../color.json");
const {getLogChannel} = require('../utils.js');
/** @type {(...args: import("discord.js").ClientEvents["emojiCreate"]) => Promise<any>} */
module.exports = async emoji => {
  const logChannel = getLogChannel(emoji.guild, db);

  if (!logChannel)
    return;

  //modLogChannel.send({ embeds: [embed] }).catch(console.error);
  const webhooks = await logChannel.fetchWebhooks();
  const webhook = webhooks.first();
  const embed = new MessageEmbed()
    .setTitle('➕ Emoji Create')
    .setColor(color.bot_theme)
    .setDescription(`Name: ${emoji} ${emoji.name}\nID: ${emoji.id}`)
    .addField('Emoji URL', emoji.url)
    .setFooter('COOL BOI BOT SERVER LOGGING')
    .setTimestamp();

  await webhook.send({
    username: 'COOL BOI BOT Logging',
    avatarURL: 'https://images-ext-1.discordapp.net/external/IRCkcws2ACaLh7lfNgQgZkwMtAPRQvML2XV1JNugLvM/https/cdn.discordapp.com/avatars/811024409863258172/699aa52d1dd597538fc33ceef502b1e6.png',
    embeds: [embed]
  });
};