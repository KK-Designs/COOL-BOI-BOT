const { MessageActionRow, MessageButton } = require('discord.js');
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
	async execute(message) {
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
			// eslint-disable-next-line no-shadow
			color = colors.map(color => color.hex())[0].toString();
			const avatarEmbed = new MessageEmbed()
				.setColor(color)
				.setTitle(`${user.username}'s avatar:`)
				.setImage(`${user.displayAvatarURL({ dynamic: true, format: 'png' })}`)
				.setTimestamp()
				.setFooter(`Powered by the ${message.client.user.username}`);

			message.channel.send({ embeds: [ avatarEmbed ], components: [ downloadAvatar ] });
		});
	},
	async executeSlash(interaction) {
		const user = interaction.options.getUser('user') ?? interaction.user;
		let color;
		getColors(user.displayAvatarURL({ format: 'png' })).then(async colors => {
			const downloadAvatar = new MessageActionRow()
			        .addComponents(
				        new MessageButton()
					      .setLabel('Download avatar')
						  .setEmoji('<:download:885276338347454494>')
						  .setURL(user.displayAvatarURL({ dynamic: true, format: 'png' }))
					      .setStyle('LINK'),
			        );
			// eslint-disable-next-line no-shadow
			color = colors.map(color => color.hex())[0].toString();
			const avatarEmbed = new MessageEmbed()
				.setColor(color)
				.setTitle(`${user.username}'s avatar:`)
				.setImage(`${user.displayAvatarURL({ dynamic: true, format: 'png' })}`)
				.setTimestamp()
				.setFooter(`Powered by the ${interaction.client.user.username}`);

			await interaction.reply({ embeds: [ avatarEmbed ], components: [ downloadAvatar ] });
		});
	},
};