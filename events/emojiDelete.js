const {MessageEmbed} = require('discord.js');
const color = require("../color.json");
const db = require('quick.db');
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
    .addField("Emoji URL", emoji.url)
    .setFooter(`COOL BOI BOT SERVER LOGGING`)
    .setTimestamp();

  await webhook.send({
    username: 'COOL BOI BOT Logging',
    avatarURL: 'https://images-ext-1.discordapp.net/external/IRCkcws2ACaLh7lfNgQgZkwMtAPRQvML2XV1JNugLvM/https/cdn.discordapp.com/avatars/811024409863258172/699aa52d1dd597538fc33ceef502b1e6.png',
    embeds: [embed]
  });
};