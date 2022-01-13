const fetch = require('node-fetch').default;
const color = require('../../color.json');
const sendError = require('../../error.js');
const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'tweet',
	description: 'Returns trump tweet!',
	usage: '[message]',
	cooldown: 2,
	aliases: ['tw'],
	category: 'image',
	clientPermissons: 'EMBED_LINKS',
	options: {
		message: {
			type: 'String',
			description: 'The message to tweet',
		},
	},
	async execute(message, args) {
		const user = message.author;

		// Get message
		if (!args[0]) {return sendError('Please provide a message to tweet', message.channel);}

		let tweet = message.cleanContent.slice(message.content.indexOf(args[0]), message.content.length);
		if (tweet.length >= 68) {tweet = tweet.slice(0, 65) + '...';}

		const res = await fetch('https://nekobot.xyz/api/imagegen?type=trumptweet&text=' + tweet);
		const img = (await res.json()).message;
		const embed = new MessageEmbed()
			.setTitle(':flag_us:  Trump Tweet  :flag_us: ')
			.setImage(img)
			.setFooter({ text: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
			.setTimestamp()
			.setColor(message.guild?.me.displayHexColor ?? color.discord);

		await message.reply({ embeds: [embed] });
	},
	async executeSlash(interaction) {
		const user = interaction.user;
		// Get message
		let tweet = interaction.options.getString('message', true);
		if (tweet.length >= 68) {tweet = tweet.slice(0, 65) + '...';}

		const res = await fetch('https://nekobot.xyz/api/imagegen?type=trumptweet&text=' + tweet);

		if (!res.ok) {return await interaction.reply(`HTTP Error ${res.status}: ${res.statusText}`);}

		const img = (await res.json()).message;
		const embed = new MessageEmbed()
			.setTitle(':flag_us:  Trump Tweet  :flag_us: ')
			.setImage(img)
			.setFooter({ text: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
			.setTimestamp()
			.setColor(interaction.guild?.me.displayHexColor ?? color.discord);

		await interaction.reply({ embeds: [embed] });
	},
};