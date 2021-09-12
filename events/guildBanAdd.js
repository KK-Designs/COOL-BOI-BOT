const {MessageEmbed} = require('discord.js');
const color = require("../color.json");
const db = require('quick.db');
const {getLogChannel} = require('../utils.js');
/** @type {(...args: import("discord.js").ClientEvents["guildBanAdd"]) => Promise<any>} */
module.exports = async (ban) => {
  if (!getLogChannel(ban.guild, db))
    return;

  const embed = new MessageEmbed()
    .setTitle('🔒 Member ban')
    .setColor(color.bot_theme)
    .setDescription(`Name: ${ban.user.username}\n \nID: ${ban.user.id}`)
    .setFooter('COOL BOI BOT MEMBER LOGGING');
  //modLogChannel.send({ embeds: [embed] }).catch(console.error);
  const webhooks = await getLogChannel(ban.guild, db).fetchWebhooks();
  const webhook = webhooks.first();

  await webhook.send({
    username: 'COOL BOI BOT Logging',
    avatarURL: 'https://images-ext-1.discordapp.net/external/IRCkcws2ACaLh7lfNgQgZkwMtAPRQvML2XV1JNugLvM/https/cdn.discordapp.com/avatars/811024409863258172/699aa52d1dd597538fc33ceef502b1e6.png',
    embeds: [embed]
  });


};