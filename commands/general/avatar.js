const { MessageEmbed } = require('discord.js');
// const getColors = require('get-image-colors');
module.exports = {
	name: 'avatar',
	aliases: ['icon', 'pfp', 'av'],
	description: 'Gives your or the mentioned users avatar!',
	usage: '(@user)',
	category: 'general',
	cooldown: 3,
	clientPermissons: 'EMBED_LINKS',
	options: {
		user: {
			type: 'User',
			description: 'The user to get the avatar of',
			required: false,
		},
	},
	async execute(message) {

		const user = message.mentions.users.first() || message.author;
		const avatarEmbed = new MessageEmbed()
			.setColor(await user.banner.color)
			.setTitle(`${user.username}'s avatar:`)
			.setImage(`${user.displayAvatarURL({ dynamic: true })}`)
			.setTimestamp()
			.setFooter('Powered by the COOL BOI BOT');

		message.channel.send({ embeds: [avatarEmbed] });
	},
	async executeSlash(interaction) {
		const user = interaction.options.getUser('user') ?? interaction.user;
		const avatarEmbed = new MessageEmbed()
			.setColor(user.banner.color)
			.setTitle(`${user.username}'s avatar:`)
			.setImage(`${user.displayAvatarURL({ dynamic: true })}`)
			.setTimestamp()
			.setFooter('Powered by the COOL BOI BOT');

		await interaction.reply({ embeds: [avatarEmbed] });
	},
};