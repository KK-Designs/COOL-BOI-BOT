module.exports = {
  name: 'beautiful',
  description: 'Self-praise yourself but if you hate yourself that much then do it to a friend (or just cuz ur nice lol)',
  usage: '(user)',
  cooldown: 3,
  category: 'image',
  clientPermissons: ['EMBED_LINKS', 'ATTACH_FILES'],
  async execute(message, args) {
    const Discord = require('discord.js');
    const DIG = require('discord-image-generation');
    const user = message.mentions.users.first() || message.author;
    const img = await new DIG.Beautiful().getImage(user.displayAvatarURL({format: 'png'}));
    const attach = new Discord.MessageAttachment(img, 'beautiful.png');
    const {MessageAttachment, MessageEmbed} = require('discord.js');
    const imageEmbed = new MessageEmbed()
	    .setTitle('Beautiful')
	    .setImage('attachment://beautiful.png')
      .setColor(message.guild?.me.displayHexColor ?? '#FFB700')
      .setTimestamp()
      .setFooter('COOL BOI BOT Images', `${message.client.user.displayAvatarURL({dynamic: true})}`);

    message.channel.send({embeds: [imageEmbed], files: [attach]});
  }
};