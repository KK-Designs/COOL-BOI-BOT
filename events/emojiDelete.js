const {MessageEmbed} = require('discord.js');
const db = require('quick.db');
const color = require("../color.json");
const {getLogChannel} = require('../utils.js');
/** @type {(...args: import("discord.js").ClientEvents["emojiDelete"]) => Promise<any>} */
module.exports = async emoji => {
  const logChannel = getLogChannel(emoji.guild, db);

  if (!logChannel)
    return;

  const webhooks = await logChannel.fetchWebhooks();
  const webhook = webhooks.first();
  const embed = new MessageEmbed()
    .setTitle('⛔ Emoji Delete')
    .setColor(color.bot_theme)
    .setDescription(`Name: ${emoji.name}\nID: ${emoji.id}`)
    .addField('Emoji URL', emoji.url)
    .setFooter('COOL BOI BOT SERVER LOGGING')
    .setTimestamp();

  await webhook.send({
    username: 'COOL BOI BOT Logging',
    avatarURL: 'https://cdn.discordapp.com/avatars/811024409863258172/f67bc2b8f122599864b02156cd67564b.png',
    embeds: [embed]
  });
};