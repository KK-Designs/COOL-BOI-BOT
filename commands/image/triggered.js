module.exports = {
  name: 'triggered',
  description: 'Get a triggered image from the specified users avatar',
  	cooldown: 3,
  usage: '(user)',
  	category: 'image',
  clientPermissons: ['EMBED_LINKS', 'ATTACH_FILES'],
  async execute(message, args) {
    const Discord = require('discord.js');
    const DIG = require('discord-image-generation');
    const user = message.mentions.users.first() || message.author;
    const img = await new DIG.Triggered().getImage(user.displayAvatarURL({format: 'png'}));
    const attach = new Discord.MessageAttachment(img, 'triggered.gif');
    const {MessageAttachment, MessageEmbed} = require('discord.js');
    const imageEmbed = new MessageEmbed()
	    .setTitle('Triggered')
	    .setImage('attachment://triggered.gif')
      .setColor(message.guild?.me.displayHexColor ?? '#FFB700')
      .setTimestamp()
      .setFooter('COOL BOI BOT Images', `${message.client.user.displayAvatarURL({dynamic: true})}`);

    message.channel.send({embeds: [imageEmbed], files: [attach]});
  }
};