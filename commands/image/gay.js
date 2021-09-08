module.exports = {
	name: 'gay',
	description: 'Make you friend gay 🏳️‍🌈',
	usage: '(user)',
	cooldown: 3,
	category: 'image',
	clientPermissons: ['EMBED_LINKS', 'ATTACH_FILES'],
	async execute(message, args) {
		const Discord = require('discord.js');
		const DIG = require('discord-image-generation');
		const user = message.mentions.users.first() || message.author;
		const img = await new DIG.Gay().getImage(user.displayAvatarURL({ format: 'png' }));
		const attach = new Discord.MessageAttachment(img, 'gay.png');
		const { MessageAttachment, MessageEmbed } = require('discord.js');
		const imageEmbed = new MessageEmbed()
	    .setTitle(user.id === message.author.id ? 'Ur gay 🏳️‍🌈' : 'Gay 🏳️‍🌈')
	    .setImage('attachment://gay.png')
			.setColor(message.channel.type === 'dm' ? '#FFB700' : message.guild.me.displayHexColor)
			.setTimestamp()
			.setFooter('COOL BOI BOT Images', `${message.client.user.displayAvatarURL({ dynamic: true })}`);
		message.channel.send({ embeds: [imageEmbed], files: [attach] });
	},
};