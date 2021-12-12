const fetch = require('node-fetch').default;
const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'clyde',
	description: 'Make the discord clyde bot send a message!  <:clyde:772958152214839307>',
	usage: '[message]',
	cooldown: 3,
	category: 'image',
	clientPermissons: 'EMBED_LINKS',
	options: {
		message: {
			type: 'String',
			description: 'The message to clydify',
		},
		user: {
			type: 'User',
			description: 'The user to clydify',
			required: false,
		},
	},
	async execute(message, args) {
		const user = message.mentions.users.first() ?? message.client.users.cache.get(args[0]) ?? message.author;

		// Get message
		if (!args[0]) {return await message.reply('Please provide a message to clydify');}

		let clyde = message.cleanContent.slice(message.content.indexOf(args[0]), message.content.length);
		if (clyde.length > 68) {clyde = clyde.slice(0, 65) + '...';}

		const res = await fetch('https://nekobot.xyz/api/imagegen?type=clyde&text=' + clyde);
		const img = (await res.json()).message;
		const embed = new MessageEmbed()
			.setTitle('<:clyde:772958152214839307>  Clyde  <:clyde:772958152214839307>')
			.setImage(img)
			.setFooter(user.username, user.displayAvatarURL({ dynamic: true }))
			.setTimestamp()
			.setColor('#CFF6FF');

		await message.reply({ embeds: [embed] });
	},
	async executeSlash(interaction, client) {
		let clyde = interaction.options.getString('message', true);

		if (clyde.length > 68) {clyde = clyde.slice(0, 65) + '...';}

		const url = new URL('api/imagegen', 'https://nekobot.xyz');

		url.searchParams.set('type', 'clyde');
		url.searchParams.set('text', clyde);
		const res = await fetch(url);

		if (!res.ok) {return await interaction.reply(`HTTP Error ${res.status}: ${res.statusText}`);}

		const img = (await res.json()).message;
		const embed = new MessageEmbed()
			.setTitle('<:clyde:772958152214839307>  Clyde  <:clyde:772958152214839307>')
			.setImage(img)
			.setFooter(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
			.setTimestamp()
			.setColor('#CFF6FF');

		await interaction.reply({ embeds: [embed] });
	},
};