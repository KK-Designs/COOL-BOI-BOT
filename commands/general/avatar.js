const { MessageEmbed } = require('discord.js');
const getColors = require('get-image-colors');
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
	async execute(message, args) {

		const user = message.mentions.users.first() || message.author;
		let color;
		getColors(user.displayAvatarURL({ format: 'png' })).then(colors => {
			color = colors.map(color => color.hex())[0].toString();
			console.log(colors.map(color => color.hex())[0].toString());
			const avatarEmbed = new MessageEmbed()
				.setColor(color)
				.setTitle(`${user.username}'s avatar:`)
				.setImage(`${user.displayAvatarURL({ dynamic: true })}`)
				.setTimestamp()
				.setFooter('Powered by the COOL BOI BOT');

			message.channel.send({ embeds: [avatarEmbed] });
		});
	},
	async executeSlash(interaction) {
		const user = interaction.options.getUser('user') ?? interaction.user;
		const colors = await getColors(user.displayAvatarURL({ format: 'png' }));
		const color = colors[0].hex('rgb').toString();

		console.log(colors.map(c => c.hex()));
		const avatarEmbed = new MessageEmbed()
			.setColor(color)
			.setTitle(`${user.username}'s avatar:`)
			.setImage(`${user.displayAvatarURL({ dynamic: true })}`)
			.setTimestamp()
			.setFooter('Powered by the COOL BOI BOT');

		await interaction.reply({ embeds: [avatarEmbed] });
	},
};