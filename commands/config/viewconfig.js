const {MessageEmbed} = require('discord.js');
const db = require('quick.db');
const prefix = require('discord-prefix');
const color = require("../../color.json");
const config = require("../../config.json");
module.exports = {
  name: 'config',
  description: 'View the bots configuration',
  cooldown: 2,
  guildOnly: true,
  category: 'config',
  aliases: ['configuration'],
  execute(message, args, client) {
    const guildPrefix = prefix.getPrefix(message.guild?.id ?? message.author.id) ?? config.defaultPrefix;
    const embed = new MessageEmbed()
      .setTitle(`${message.guild.name} config`)
      .setThumbnail(message.guild.iconURL())
      .addFields(
        {name: '**Prefix**', value: `${guildPrefix}`, inline: true},
        {name: '**Audit logging channel**', value: `${db.get('loggingchannel_' + message.guild.id) === '0' ? `None, do \`${guildPrefix}setlogChannel [#channel]\` to configure this.` : '<#' + db.get('loggingchannel_' + message.guild.id) + '>'}`, inline: true},
        {name: '**Welcome channel**', value: `${db.get('welcomechannel_' + message.guild.id) === '0' ? `None, do \`${guildPrefix}setwelcomeChannel [#channel]\` to configure this.` : '<#' + db.get('welcomechannel_' + message.guild.id) + '>'}`, inline: true}
      )
      .setTimestamp()
      .setFooter(message.guild.name, message.guild.iconURL())
      .setColor(message.guild?.me.displayHexColor ?? '#FFB700');

    message.reply({embeds: [embed]});

  }
};