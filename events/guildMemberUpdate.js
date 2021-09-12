const {MessageEmbed} = require('discord.js');
const color = require("../color.json");
const db = require('quick.db');
/** @type {(...args: import("discord.js").ClientEvents["guildMemberUpdate"]) => Promise<any>} */
module.exports = async (oldMember, newMember) => {
  
  // Always true
  //if (oldMember == newMember)
  //  return;

  const modLogChannelID = db.get('loggingchannel_' + oldMember.guild.id);
  const modLogChannel = oldMember.guild.channels.cache.get(modLogChannelID);
  if (!modLogChannel)
    return;

  if (oldMember.nickname !== newMember.nickname) {
    const embed = new MessageEmbed()
      .setAuthor('👤 Nickname changed')
      .setColor(color.bot_theme)
      .setDescription(`<@${newMember.id}> changed their nickname`)
      .addField('Old nickname:', `${oldMember.nickname !== null ? `${oldMember.nickname}` : oldMember.user.username}`, true)
      .addField('New nickname:', `${newMember.nickname !== null ? `${newMember.nickname}` : oldMember.user.username}`, true)
      //.setThumbnail(`${oldMember.user.displayAvatarURL}`)
      .setFooter(`COOL BOI BOT MEMBER LOGGING`)
      .setTimestamp();

    await modLogChannel.send(embed);
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
    await modLogChannel.send({embeds: [embed]});
  }


};