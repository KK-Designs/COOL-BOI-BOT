module.exports = {
	name: 'avatar',
	aliases: ['icon', 'pfp', 'av'],
	description: 'Gives your or the mentioned users avatar!',
	usage: '(@user)',
	category: 'general',
	cooldown: 3,
	clientPermissons: 'EMBED_LINKS',
	execute(message, args) {
		const { MessageActionRow, MessageButton } = require('discord.js');
		const { MessageEmbed } = require('discord.js');
		const getColors = require('get-image-colors');
		const user = message.mentions.users.first() || message.author;
		let color;
		getColors(user.displayAvatarURL({ format: 'png' })).then(colors => {
			const downloadAvatar = new MessageActionRow()
			        .addComponents(
				        new MessageButton()
					      .setLabel('Download avatar')
						  .setEmoji('<:download:885276338347454494>')
						  .setURL(user.displayAvatarURL({ dynamic: true, format: 'png' }))
					      .setStyle('LINK'),
			        );
			color = colors.map(color => color.hex())[0].toString();
			const avatarEmbed = new MessageEmbed()
				.setColor(color)
				.setTitle(`${user.username}'s avatar:`)
				.setImage(`${user.displayAvatarURL({ dynamic: true, format: 'png' })}`)
				.setTimestamp()
				.setFooter('Powered by the COOL BOI BOT');

			message.channel.send({ embeds: [ avatarEmbed ], components: [ downloadAvatar ] });
		});
	},
};