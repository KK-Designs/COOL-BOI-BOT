module.exports = {
	name: 'avatar',
	aliases: ['icon', 'pfp', 'av'],
	description: 'Gives your or the mentioned users avatar!',
	usage: '(@user)',
	category: 'general',
	cooldown: 3,
	clientPermissons: 'EMBED_LINKS',
	execute(message, args) {
		const { MessageEmbed } = require('discord.js');
		const getColors = require('get-image-colors');
		    const user = message.mentions.users.first() || message.author;
		let color;
		getColors(user.displayAvatarURL({ format: 'png' })).then(colors => {
			color = colors.map(color => color.hex())[0].toString();
			const avatarEmbed = new MessageEmbed()
				.setColor(color)
				.setTitle(`${user.username}'s avatar:`)
				.setImage(`${user.displayAvatarURL({ dynamic: true })}`)
				.setTimestamp()
				.setFooter('Powered by the COOL BOI BOT');

			message.channel.send({ embeds: [ avatarEmbed ] });
		});
	},
};