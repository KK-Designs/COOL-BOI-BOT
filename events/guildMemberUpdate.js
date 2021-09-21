const {MessageEmbed} = require('discord.js');
const {getLogChannel} = require('../utils.js');
const color = require("../color.json");
const db = require('quick.db');
const config = require("../config.json");
/** @type {(...args: import("discord.js").ClientEvents["guildMemberUpdate"]) => Promise<any>} */
module.exports = async (oldMember, newMember) => {
  const logChannel = getLogChannel(oldMember.guild, db);

  if (!logChannel)
    return;

  if (oldMember.nickname !== newMember.nickname) {
    const embed = new MessageEmbed()
      .setAuthor('👤 Nickname changed')
      .setColor(color.bot_theme)
      .setDescription(`<@${newMember.id}> changed their nickname`)
      .addField('Old nickname:', `${oldMember.displayName}`, true)
      .addField('New nickname:', `${newMember.displayName}`, true)
      .setFooter('COOL BOI BOT MEMBER LOGGING')
      .setTimestamp();
    //modLogChannel.send({ embeds: [embed] }).catch(console.error);
    const webhooks = await logChannel.fetchWebhooks();
    const webhook = webhooks.first();

    await webhook.send({
      username: 'COOL BOI BOT Logging',
      avatarURL: config.webhookAvatarURL,
      embeds: [embed]
    });
  }
  nick: {
    const output = oldMember.roles.cache.map(role => role.name).join("\n");
    const outputNew = newMember.roles.cache.map(role => role.name).join("\n");

    if (output == outputNew)
      break nick;


    let embed = new MessageEmbed()
      .setAuthor('👤 Member roles updated')
      .setColor(color.bot_theme)
      .setDescription(`Roles updated for <@${newMember.id}>`)
      .addField('Old roles:', `${output}`, true)
      .addField('New roles:', `឵${outputNew}`, true)
      .setThumbnail(`${oldMember.user.displayAvatarURL({dynamic: true})}`)
      .setFooter(`COOL BOI BOT MEMBER LOGGING`)
      .setTimestamp();
    //modLogChannel.send({ embeds: [embed] }).catch(console.error);
    const webhooks = await logChannel.fetchWebhooks();
    const webhook = webhooks.first();

    await webhook.send({
      username: 'COOL BOI BOT Logging',
      avatarURL: config.webhookAvatarURL,
      embeds: [embed]
    });
  }
  if (oldMember.user.avatar !== newMember.user.avatar) {
    const embed = new MessageEmbed()
      .setAuthor('👤 Member avatar updated')
      .setColor(color.bot_theme)
      .setDescription(`Avatar updated for <@${newMember.id}>`)
      .addField('Old avatar:', `${oldMember.user.displayAvatarURL({dynamic: true})}`, true)
      .addField('New avatar:', `឵${newMember.user.displayAvatarURL({dynamic: true})}`, true)
      .setFooter('COOL BOI BOT MEMBER LOGGING')
      .setTimestamp();
    //modLogChannel.send({ embeds: [embed] }).catch(console.error);
    const webhooks = await logChannel.fetchWebhooks();
    const webhook = webhooks.first();

    await webhook.send({
      username: 'COOL BOI BOT Logging',
      avatarURL: config.webhookAvatarURL,
      embeds: [embed]
    });
  }

};