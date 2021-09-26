const fetch = require('node-fetch').default;
const sendError = require('../../error.js');
const color = require('../../color.json');
const querystring = require('querystring');
const { MessageEmbed } = require('discord.js');
const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);
module.exports = {
	name: 'urban',
	description: 'Gets the specified definition on urban dictionary 📖',
	cooldown: 2.5,
	category: 'fun',
	options: {
		query: {
			type: 'String',
			description: 'The thing to search for',
		},
	},
	async execute(message, args, client) {
		if (!args.length) {
			return sendError('You need to supply a search term!', message.channel);
		}
		const query = args.join(' ');
		const url = new URL('/v0/define', 'https://api.urbandictionary.com/');

		url.searchParams.set('term', query);
		const res = await fetch(url);

		if (!res.ok) {return await message.reply(`HTTP Error ${res.status}: ${res.statusText}`);}

		const { list } = await res.json();

		if (!list.length) {
			return message.reply({ content: `No results found for **${args.join(' ')}**.` });
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

		await message.reply({ embeds: [embed] });
	},
	async executeSlash(interaction) {
		const query = interaction.options.getString('query', true);
		const url = new URL('/v0/define', 'https://api.urbandictionary.com/');

		url.searchParams.set('term', query);
		const res = await fetch(url);

		if (!res.ok) {return await interaction.reply(`HTTP Error ${res.status}: ${res.statusText}`);}

		const { list } = await res.json();

		if (!list.length) {
			return await interaction.reply({ content: `No results found for **${query}**.` });
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

		await interaction.reply({ embeds: [embed] });
	},
};