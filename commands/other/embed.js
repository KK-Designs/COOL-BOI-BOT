const color = require("../../color.json");
const {MessageEmbed} = require('discord.js');
module.exports = {
  name: 'embed',
  description: 'Gets your custom message embed!',
  usage: '[title] (description) (footer)',
  cooldown: 3,
  category: 'other',
  clientPermissons: 'EMBED_LINKS',
  options: {},
  async execute(message, args) {
    
    const customargs = args.join(' ').split('|');

    if (!args[0]) {
      return message.reply({
        content: 'You must provide a title. Feilds are seperated by `|` Like this: `!embed Test embed | embed description | embed footer` '
      });
    }
    const customEmbed = new MessageEmbed()
      .setColor(color.discord)
      .setTitle(customargs[0])
      .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
      .setDescription(!customargs[1] ? '\u200B' : customargs[1])
      .setFooter(!customargs[2] ? '\u200B' : customargs[2]);

    message.channel.send({embeds: [customEmbed]});
  }
};