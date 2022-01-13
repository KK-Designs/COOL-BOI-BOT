module.exports = {
	name: 'wanted',
	description: 'Get a wanted image from the specified users avatar',
	usage: '(user)',
	cooldown: 3,
	category: 'image',
	clientPermissons: ['EMBED_LINKS', 'ATTACH_FILES'],
	async execute(message, args) {
		const Discord = require('discord.js');
		const DIG = require('discord-image-generation');
		const user = message.mentions.users.first() || message.author;
		const img = await new DIG.Wanted().getImage(
			user.displayAvatarURL({ format: 'png' }),
			'$',
		);
		const attach = new Discord.MessageAttachment(img, 'wanted.png');
		const { MessageAttachment, MessageEmbed } = require('discord.js');
		const imageEmbed = new MessageEmbed()
			.setTitle('Wanted')
			.setImage('attachment://wanted.png')
			.setColor(
				message.channel.type === 'dm'
					? '#FFB700'
					: message.guild.me.displayHexColor,
			)
			.setTimestamp()
			.setFooter(
				'COOL BOI BOT Images',
				`${message.client.user.displayAvatarURL({ dynamic: true })}`,
			);
		message.channel.send({ embeds: [imageEmbed], files: [attach] });
	},
};
