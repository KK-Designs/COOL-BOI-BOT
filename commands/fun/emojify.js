const color = require("../../color.json");
const sendError = require("../../error.js");
const {MessageEmbed} = require('discord.js');
const numberMap = {
  '0': ':zero:',
  '1': ':one:',
  '2': ':two:',
  '3': ':three:',
  '4': ':four:',
  '5': ':five:',
  '6': ':six:',
  '7': ':seven:',
  '8': ':eight:',
  '9': ':nine:'
};
const numericalMap = {
  '?': ':question:',
  '!': ':exclamation:',
  'x': ':x:',
  '!!': ':bangbang:',
  '!?': ':interrobang:',
  '$': ':heavy_dollar_sign:',
  '#': ':hash:',
  '*': ':asterisk:'
};
module.exports = {
  name: 'emojify',
  description: 'Emojifies your text!',
  usage: '[message]',
  cooldown: 3,
  category: 'fun',
  clientPermissons: 'EMBED_LINKS',
  options: {
    message: {
      type: "String",
      description: "The text to emojify"
    }
  },
  execute(message, args) {
    if (!args[0]) {
      return sendError('Please provide text for me to emojify (i.e. `!emojify hello`)', message.channel);
    }
    const user = message.author
    let msg = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    msg = msg.split('').map(c => {
      if (c === ' ')
        return c;
      else if (/[0-9]/.test(c))
        return numberMap[c];
      else if (/^[?!!!!?$x#*]*$/.test(c))
        return numericalMap[c];

      return /[a-zA-Z]/.test(c) ? ':regional_indicator_' + c.toLowerCase() + ':' : '';
    }).join('');
    if (msg.length > 2048) {
      msg = msg.slice(0, msg.length - (msg.length - 2033));
      msg = msg.slice(0, msg.lastIndexOf(':')) + '**...**';
    }
    const emojiembed = new MessageEmbed()
      .setTitle('Emojified Text:')
      .setDescription(msg)
      .setFooter(user.username, user.displayAvatarURL({dynamic: true}))
      .setTimestamp()
      .setColor(message.channel.type === 'DM' ? color.discord : message.guild.me.displayHexColor
      );

    message.reply({embeds: [emojiembed]});
  },
  async executeSlash(interaction) {
    const user = interaction.user
    let msg = interaction.options.getString('message', true)
    msg = msg.split('').map(c => {
      if (c === ' ')
        return c;
      else if (/[0-9]/.test(c))
        return numberMap[c];
      else if (/^[?!!!!?$x#*]*$/.test(c))
        return numericalMap[c];

      return /[a-zA-Z]/.test(c) ? ':regional_indicator_' + c.toLowerCase() + ':' : '';
    }).join('');
    if (msg.length > 2048) {
      msg = msg.slice(0, msg.length - (msg.length - 2033));
      msg = msg.slice(0, msg.lastIndexOf(':')) + '**...**';
    }
    const emojiembed = new MessageEmbed()
      .setTitle('Emojified Text:')
      .setDescription(msg)
      .setFooter(user.username, user.displayAvatarURL({dynamic: true}))
      .setTimestamp()
      .setColor(interaction.guild?.me.displayHexColor ?? color.discord);

    await interaction.reply({embeds: [emojiembed]});
  }
};