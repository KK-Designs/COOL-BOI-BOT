module.exports = {
  name: 'stonks',
  description: 'Get a stonk image from the specified users avatar ️️️️️📈',
  usage: '(user)',
  	cooldown: 3,
  	category: 'image',
  clientPermissons: ['EMBED_LINKS', 'ATTACH_FILES'],
  async execute(message, args) {
    const Discord = require('discord.js');
    const DIG = require('discord-image-generation');
    const user = message.mentions.users.first() || message.author;
    const img = await new DIG.Stonk().getImage(user.displayAvatarURL({format: 'png'}));
    const attach = new Discord.MessageAttachment(img, 'stonks.png');
    const {MessageAttachment, MessageEmbed} = require('discord.js');
    const imageEmbed = new MessageEmbed()
	    .setTitle('Stonks')
	    .setImage('attachment://stonks.png')
      .setColor(message.guild?.me.displayHexColor ?? '#FFB700')
      .setTimestamp()
      .setFooter('COOL BOI BOT Images', `${message.client.user.displayAvatarURL({dynamic: true})}`);

    message.channel.send({embeds: [imageEmbed], files: [attach]});
  }
};