const {MessageEmbed} = require('discord.js');
const color = require("../color.json");
const db = require('quick.db');
const {getLogChannel} = require('../utils.js');
/** @type {(...args: import("discord.js").ClientEvents["channelDelete"]) => Promise<any>} */
module.exports = async channel => {
  if (channel.type == 'DM')
    return;

  if (getLogChannel(channel.guild, db)) {

    if (!getLogChannel(channel.guild, db).permissionsFor(channel.guild.me).has('VIEW_CHANNEL'))
      return;

    if (!getLogChannel(channel.guild, db).permissionsFor(channel.guild.me).has('SEND_MESSAGES'))
      return;

    const embed = new MessageEmbed()
      .setAuthor('⛔ Channel deleted')
      .setColor(color.fail)
      .setDescription(`Deleted channel #${channel.name}`)
      .setFooter('COOL BOI BOT SERVER LOGGING')
      .setTimestamp();
    //modLogChannel.send({ embeds: [embed] }).catch(console.error);
    const webhooks = await getLogChannel(channel.guild, db).fetchWebhooks();
    const webhook = webhooks.first();

    await webhook.send({
      username: 'COOL BOI BOT Logging',
      avatarURL: 'https://images-ext-1.discordapp.net/external/IRCkcws2ACaLh7lfNgQgZkwMtAPRQvML2XV1JNugLvM/https/cdn.discordapp.com/avatars/811024409863258172/699aa52d1dd597538fc33ceef502b1e6.png',
      embeds: [embed]
    });
  }


};