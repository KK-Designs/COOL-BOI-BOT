module.exports = {
	name: 'urban',
	description: 'Gets the specified definition on urban dictionary 📖',
	cooldown: 2.5,
	category: 'fun',
	async	execute(message, args, client) {
		const fetch = require('node-fetch');
		const sendError = require('../../error.js');
		const color = require('../../color.json');
		const querystring = require('querystring');
		const { MessageEmbed } = require('discord.js');
		const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);

		if (!args.length) {
			return sendError('You need to supply a search term!', message.channel);
		}
		const query = querystring.stringify({ term: args.join(' ') });
		const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then(response => response.json());
		if (!list.length) {
			return message.channel.send({ content: `No results found for **${args.join(' ')}**.`, reply: { messageReference: message.id } });
		}
		const [answer] = list;
		const embed = new MessageEmbed()
			.setColor(color.random)
			.setTitle(answer.word)
			.setURL(answer.permalink)
      		.setThumbnail('https://images-ext-2.discordapp.net/external/HMmIAukJm0YaGc2BKYGx5MuDJw8LUbwqZM9BW9oey5I/https/i.imgur.com/VFXr0ID.jpg')
			.addFields(
				{ name: 'Definition', value: trim(answer.definition, 1024) },
				{ name: 'Example', value: trim(answer.example, 1024) },
				{ name: 'Rating', value: `👍 ${answer.thumbs_up} thumbs up. 👎 ${answer.thumbs_down} thumbs down.` },
			);
		message.channel.send({ embeds: [embed], reply: { messageReference: message.id } });
	},
};