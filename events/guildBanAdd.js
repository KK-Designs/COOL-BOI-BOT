const {MessageEmbed} = require('discord.js');
const color = require("../color.json");
const db = require('quick.db');
const {getLogChannel} = require('../utils.js');
/** @type {(...args: import("discord.js").ClientEvents["guildBanAdd"]) => Promise<any>} */
module.exports = async (ban) => {
  if (!getLogChannel(ban.guild, db))
    return;

  const webhooks = await getLogChannel(ban.guild, db).fetchWebhooks();
  const webhook = webhooks.first();
  const embed = new MessageEmbed()
    .setTitle('🔒 Member ban')
    .setColor(color.bot_theme)
    .setDescription(`Name: ${ban.user.username}\n \nID: ${ban.user.id}`)
    .setFooter('COOL BOI BOT MEMBER LOGGING');

  await webhook.send({
    username: 'COOL BOI BOT Logging',
    avatarURL: 'https://cdn.discordapp.com/avatars/811024409863258172/f67bc2b8f122599864b02156cd67564b.png',
    embeds: [embed]
  });


};