const prefix = require('discord-prefix');
const {MessageEmbed} = require('discord.js');
const color = require("../../color.json");
const config = require("../../config.json");
module.exports = {
  name: 'prefix',
  description: 'Get the bots prefix! ***This command prefix is always \`!\` ***',
  cooldown: 2,
  guildOnly: true,
  category: 'util',
  clientPermissons: 'EMBED_LINKS',
  permissons: 'ADMINISTRATOR',
  execute(message, args) {
    let guildPrefix = prefix.getPrefix(message.guild?.id ?? message.author.id) ?? config.defaultPrefix;
    const embed = new MessageEmbed()
      .setTitle(`The bots prefix is ${guildPrefix}`)
      .setColor(message.guild?.me.displayHexColor ?? color.discord)
      .setThumbnail('https://images-ext-2.discordapp.net/external/PtRqDuS2wA-2WgNWTTLOwbG-B6ioUW6YPiRtxgs4ap4/https/cdn.discordapp.com/avatars/769415264306987068/699aa52d1dd597538fc33ceef502b1e6.webp')
      .setDescription('This command prefix is always \`!\` or a @mention')
      .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}))
      .setTimestamp();
    
    message.reply({embeds: [embed]});

  }
};