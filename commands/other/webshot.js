const fs = require('fs');
const {MessageAttachment, MessageEmbed} = require('discord.js');
const printscreen = require('printscreen');
const sendError = require('../../error.js');
const color = require('../../color.json');
const regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
module.exports = {
  name: 'webshot',
  description: 'Gets the screen shot of the specified URL 🔗',
  cooldown: 3,
  usage: '[url]',
  category: 'other',
  options: {},
  async execute(message, args, client) {
    const user = message.author;

    if (!args.length)
      return sendError('Put a url for me to get a screenshot', message.channel);

    if (!args[0].match(regex))
      return sendError('Please provide a valid URL. Something like `https://google.com`', message.channel);

    const data = await new Promise((resolve, reject) => {
      printscreen(args[0], {
        viewport: {
          width: 1650,
          height: 1060
        },
        format: "png",
        timeout: 5000
      }, (err, d) => (err ? reject(err) : resolve(d)));
    });
    const attachment = new MessageAttachment(data.filepath, "img.png");
    const embed = new MessageEmbed()
      .setTitle(`Web shot for ${args[0]}`)
      .setImage(`attachment://${attachment.name}`)
      .setAuthor(user.username)
      .setColor(message.guild?.me.displayHexColor ?? color.discord)
      .setFooter(user.username, user.displayAvatarURL({dynamic: true}));
 
    await message.reply({embeds: [embed], files: [attachment]});
  }
};