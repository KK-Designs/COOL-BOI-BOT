module.exports = {
	name: 'fact',
	description: '<:check:807305471282249738> Gives a random fact!',
	cooldown: 1.5,
	category: 'info',
	async execute(message) {
		const fetch = require('node-fetch');
		const res = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
		const fact = await res.json();
		const user = message.author;
		const color = require('../../color.json');
		const { MessageEmbed } = require('discord.js');
		const embed = new MessageEmbed()
			.setColor(color.bot_theme)
			.setTitle('Random fact')
			.setURL(fact.source_url.toString())
			.setDescription(fact.text.toString())
			.setFooter({ text: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
			.setTimestamp();

		await message.reply({ embeds: [embed] });
	},
};
