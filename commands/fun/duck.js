module.exports = {
	name: 'duck',
	description: 'Return a random image of a duck! <:duck:800843897219711016>',
	cooldown: 1.5,
	clientPermissons: 'EMBED_LINKS',
	category: 'fun',
	async execute(message, args) {
		const user = message.author;
		const fetch = require('node-fetch');
		const color = require('../../color.json');
		const sendError = require('../../error.js');
		const { MessageEmbed } = require('discord.js');
		try {
			const res = await fetch('https://random-d.uk/api/v2/random');
			const img = (await res.json()).url;
			const embed = new MessageEmbed()
				.setColor(color.bot_theme)
				.setTitle('<:duck:800843897219711016> Duck <:duck:800843897219711016>')
				.setImage(img)
				.setFooter(user.username, user.displayAvatarURL({ dynamic: true }))
				.setTimestamp();
			message.channel.send({ embeds: [embed] });
		}
		catch (err) {
			sendError(err, message.channel);
		}
	},
};