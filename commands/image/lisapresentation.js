module.exports = {
	  name: 'lisapresentation',
	  description: 'Create your own lisa presentation',
  usage: '[text]',
  aliases: ['present', 'lisa'],
  	cooldown: 3,
  	category: 'image',
  clientPermissons: ['EMBED_LINKS', 'ATTACH_FILES'],
	  async execute(message, args) {
    const Discord = require('discord.js');
    const DIG = require('discord-image-generation');
    const text = args.join(' ');

    if (!text)
      return message.channel.send({content: 'Please provide text for me to make a lisa presentation', reply: {messageReference: message.id}});

    if (text.length > 300)
      return message.channel.send({content: 'I can only make a lisa presentation out of 300 characters', reply: {messageReference: message.id}});

    const img = await new DIG.LisaPresentation().getImage(text);
    const attach = new Discord.MessageAttachment(img, 'LisaPresentation.png');
    const {MessageAttachment, MessageEmbed} = require('discord.js');
    const imageEmbed = new MessageEmbed()
	      .setTitle('Lisa Presentation')
	      .setImage('attachment://LisaPresentation.png')
      .setColor(message.guild?.me.displayHexColor ?? '#FFB700')
      .setTimestamp()
      .setFooter('COOL BOI BOT Images', `${message.client.user.displayAvatarURL({dynamic: true})}`);

		    message.channel.send({embeds: [imageEmbed], files: [attach]});
	  }
};