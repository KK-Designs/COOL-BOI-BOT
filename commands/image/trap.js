module.exports = {
	name: 'jail',
	description: 'Jail your friends!',
	aliases: ['trap'],
	usage: '(user)',
	cooldown: 3,
	category: 'image',
	clientPermissons: ['EMBED_LINKS', 'ATTACH_FILES'],
	async execute(message, args) {
		const Discord = require('discord.js');
		const DIG = require('discord-image-generation');
		const user = message.mentions.users.first() || message.author;
		const img = await new DIG.Jail().getImage(
			user.displayAvatarURL({ format: 'png' }),
		);
		const attach = new Discord.MessageAttachment(img, 'jail.png');
		const { MessageAttachment, MessageEmbed } = require('discord.js');
		const imageEmbed = new MessageEmbed()
			.setTitle('Jail')
			.setImage('attachment://jail.png')
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
