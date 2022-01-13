module.exports = {
	name: 'tweet',
	description: 'Returns trump tweet!',
	usage: '[message]',
	cooldown: 2,
	aliases: ['tw', 'ttweet'],
	category: 'image',
	clientPermissons: 'EMBED_LINKS',
	async execute(message, args) {
		const user = message.author;
		const fetch = require('node-fetch');
		const color = require('../../color.json');
		const sendError = require('../../error.js');
		const { MessageEmbed } = require('discord.js');
		// Get message
		if (!args[0]) {return sendError('Please provide a message to tweet', message.channel);}
		let tweet = message.content.slice(
			message.content.indexOf(args[0]),
			message.content.length,
		);
		if (tweet.length >= 68) tweet = tweet.slice(0, 65) + '...';

		try {
			const res = await fetch(
				'https://nekobot.xyz/api/imagegen?type=trumptweet&text=' + tweet,
			);
			const img = (await res.json()).message;
			const embed = new MessageEmbed()
				.setTitle(':flag_us:  Trump Tweet  :flag_us: ')
				.setImage(img)
				.setFooter(user.username, user.displayAvatarURL({ dynamic: true }))
				.setTimestamp()
				.setColor(
					message.channel.type === 'dm'
						? color.discord
						: message.guild.me.displayHexColor,
				);
			message.channel.send({ embeds: [embed] });
		}
		catch (err) {
			sendError(
				`Oops, well this is an error. If this continues dm <@765686109073440808>. \n \nSpeficic error: ${err}`,
				message.channel,
			);
		}
	},
};
