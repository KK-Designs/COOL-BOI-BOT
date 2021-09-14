module.exports = {
  name: 'kiss',
  description: 'Kiss your friend! Or yourself',
  usage: '[user1, user2]',
  	cooldown: 3,
  	category: 'image',
  clientPermissons: ['EMBED_LINKS', 'ATTACH_FILES'],
  async execute(message, args) {
    const Discord = require('discord.js');
    const DIG = require('discord-image-generation');
    const user = message.mentions.users.first();

    if (!user)
      return await message.reply({content: 'You need to mention someone to kiss them unless your already engaged'});

    if (user.id === message.author.id)
      return await message.reply({content: 'You can\'t kiss yourself you idiot. Wait a minute... 🤔'});

    const img = await new DIG.Kiss().getImage(message.author.displayAvatarURL({format: 'png'}), user.displayAvatarURL({format: 'png'}));
    const attach = new Discord.MessageAttachment(img, 'kiss.png');
    const {MessageAttachment, MessageEmbed} = require('discord.js');
    const imageEmbed = new MessageEmbed()
	    .setTitle('Kiss ❤️‍🔥')
	    .setImage('attachment://kiss.png')
      .setColor(message.guild?.me.displayHexColor ?? '#FFB700')
      .setTimestamp()
      .setFooter('COOL BOI BOT Images', `${message.client.user.displayAvatarURL({dynamic: true})}`);

    message.channel.send({embeds: [imageEmbed], files: [attach]});
  }
};