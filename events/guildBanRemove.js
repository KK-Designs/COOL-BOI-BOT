const {MessageEmbed} = require('discord.js');
const db = require('quick.db');
const color = require("../color.json");
const {getLogChannel} = require('../utils.js');
/** @type {(...args: import("discord.js").ClientEvents["guildBanRemove"]) => Promise<any>} */
module.exports = async (ban) => {
  const logChannel = getLogChannel(ban.guild, db);

  if (!logChannel)
    return;

  const embed = new MessageEmbed()
    .setTitle('🔓 Member Unban')
    .setColor(color.bot_theme)
    .setDescription(`Name: ${ban.user.username}\n \nID: ${ban.user.id}`)
    .setFooter('COOL BOI BOT MEMBER LOGGING');
  //modLogChannel.send({ embeds: [embed] }).catch(console.error);
  const webhooks = await logChannel.fetchWebhooks();
  const webhook = webhooks.first();

  await webhook.send({
    username: 'COOL BOI BOT Logging',
    avatarURL: 'https://cdn.discordapp.com/avatars/811024409863258172/f67bc2b8f122599864b02156cd67564b.png',
    embeds: [embed]
  });
};