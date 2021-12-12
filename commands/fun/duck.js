const fetch = require('node-fetch').default;
const color = require('../../color.json');
const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'duck',
	description: 'Return a random image of a duck! <:duck:800843897219711016>',
	cooldown: 1.5,
	clientPermissons: 'EMBED_LINKS',
	category: 'fun',
	options: {},
	async execute(message) {
		const user = message.author;
		const res = await fetch('https://random-d.uk/api/v2/random');
		const img = (await res.json()).url;
		const embed = new MessageEmbed()
			.setColor(color.bot_theme)
			.setTitle('<:duck:800843897219711016> Duck <:duck:800843897219711016>')
			.setImage(img)
			.setFooter(user.username, user.displayAvatarURL({ dynamic: true }))
			.setTimestamp();

		await message.reply({ embeds: [embed] });
	},
	async executeSlash(interaction) {
		const user = interaction.user;
		const res = await fetch('https://random-d.uk/api/v2/random');

		if (!res.ok) {return await interaction.reply(`HTTP Error ${res.status}: ${res.statusText}`);}

		const img = (await res.json()).url;
		const embed = new MessageEmbed()
			.setColor(color.bot_theme)
			.setTitle('<:duck:800843897219711016> Duck <:duck:800843897219711016>')
			.setImage(img)
			.setFooter(user.username, user.displayAvatarURL({ dynamic: true }))
			.setTimestamp();

		await interaction.reply({ embeds: [embed] });
	},
};