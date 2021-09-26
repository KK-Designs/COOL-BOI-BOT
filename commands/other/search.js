const { MessageEmbed } = require('discord.js');
const google = require('googlethis');
const sendError = require('../../error.js');
module.exports = {
	name: 'search',
	description: 'Search for the specified query! 🔎',
	usage: '[query]',
	aliases: ['google'],
	cooldown: 5,
	clientPermissons: 'EMBED_LINKS',
	category: 'other',
	async execute(message, args, client) {

		const options = {
			page: 0,
			safe: true, // hide explicit results
			additional_params: {
				// add additional parameters here, see https://moz.com/blog/the-ultimate-guide-to-the-google-search-parameters and https://www.seoquake.com/blog/google-search-param/
				hl: 'en',
			},
		};
		const query = args.join(' ');

		if (!query) {
			return sendError('I need a something to search for!', message.channel);
		}
		const embed = new MessageEmbed()
			.setTitle('<a:loading:808390866367545384> Searching...')
			.setColor(message.channel.type === 'GUILD_TEXT' ? message.guild.me.displayHexColor : '#FFB700');

		await message.reply({ embeds: [embed] }).then(async (msg) => {
			const response = await google.search(query, options);

			if (response.results.length === 0) {
				msg.delete();

				return await message.reply({ content: `I found nothing matching "${query}"!` });
			}
			const googleEmbed = new MessageEmbed()
				.setColor(message.channel.type === 'GUILD_TEXT' ? message.guild.me.displayHexColor : '#FFB700')
				.setTitle(`Search results for "${query}"\n━━━━━━━━━━━━━━━━━━━━━━`)
				.addField(`${response.results[0].title}\n${response.results[0].url}`, `\n${response.results[0].description}`)
				.addField(`${response.results[1].title}\n${response.results[1].url}`, `\n${response.results[1].description}`)
				.addField(`${response.results[2].title}\n${response.results[2].url}`, `\n${response.results[2].description}`)
				.addField(`${response.results[3].title}\n${response.results[3].url}`, `\n${response.results[3].description}`)
				.addField(`${response.results[4].title}\n${response.results[4].url}`, `\n${response.results[4].description}`)
				.setTimestamp()
				.setFooter('Powered by Google®', 'https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png');

			setTimeout(() => {
				msg.edit({ embeds: [googleEmbed] });
			}, 2000);
		});
	},
};