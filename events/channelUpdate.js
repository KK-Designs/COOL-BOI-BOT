const {MessageEmbed} = require('discord.js');
const db = require('quick.db');
const {getLogChannel} = require('../utils.js');
const color = require("../color.json");
/** @type {(...args: import("discord.js").ClientEvents["channelUpdate"]) => Promise<any>} */
module.exports = async (oldchannel, newchannel) => {
  if (oldchannel.type === 'DM' || oldchannel.name === newchannel.name)
    return;

  if (getLogChannel(oldchannel.guild, db)) {

    if (!getLogChannel(oldchannel.guild, db).permissionsFor(newchannel.guild.me).has('VIEW_CHANNEL'))
      return;

    if (!getLogChannel(oldchannel.guild, db).permissionsFor(newchannel.guild.me).has('SEND_MESSAGES'))
      return;

    const embed = new MessageEmbed()
      .setAuthor('📝 Channel updated')
      .setColor(color.bot_theme)
      .setDescription(`Channel Updated ${oldchannel}`)
      .addField('Old channel:', `${oldchannel.name}`, true)
      .addField('New channel:', `${newchannel.name}`, true)
      .setFooter('COOL BOI BOT SERVER LOGGING')
      .setTimestamp();
    //modLogChannel.send({ embeds: [embed] }).catch(console.error);
    const webhooks = await getLogChannel(oldchannel.guild, db).fetchWebhooks();
    const webhook = webhooks.first();

    await webhook.send({
      username: 'COOL BOI BOT Logging',
      avatarURL: 'https://images-ext-1.discordapp.net/external/IRCkcws2ACaLh7lfNgQgZkwMtAPRQvML2XV1JNugLvM/https/cdn.discordapp.com/avatars/811024409863258172/699aa52d1dd597538fc33ceef502b1e6.png',
      embeds: [embed]
    });


  }

};