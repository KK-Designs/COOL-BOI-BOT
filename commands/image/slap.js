module.exports = {
	name: 'slap',
	description: 'Slap your friends!',
	usage: '[user1, user2]',
  	cooldown: 3,
  	category: 'image',
	clientPermissons: ['EMBED_LINKS', 'ATTACH_FILES'],
	async execute(message, args) {
		const Discord = require('discord.js');
		const DIG = require('discord-image-generation');
		const user = message.mentions.users.first();
		if (!user) return message.channel.send({ content: 'You need to mention someone to slap them unless your too nice', reply: { messageReference: message.id } });
		if (user.id === message.author.id) return message.channel.send({ content: 'You can\'t slap yourself you idiot. Wait a minute... 🤔', reply: { messageReference: message.id } });
		const img = await new DIG.Batslap().getImage(message.author.displayAvatarURL({ format: 'png' }), user.displayAvatarURL({ format: 'png' }));
		const attach = new Discord.MessageAttachment(img, 'slap.png');
		const { MessageAttachment, MessageEmbed } = require('discord.js');
		const imageEmbed = new MessageEmbed()
	    .setTitle('Slap')
	    .setImage('attachment://slap.png')
			.setColor(message.channel.type === 'dm' ? '#FFB700' : message.guild.me.displayHexColor)
			.setTimestamp()
			.setFooter('COOL BOI BOT Images', `${message.client.user.displayAvatarURL({ dynamic: true })}`);
		message.channel.send({ embeds: [imageEmbed], files: [attach] });
	},
};