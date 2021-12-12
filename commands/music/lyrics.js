const { MessageEmbed } = require('discord.js');
const color = require('../../color.json');
const fetch = require('node-fetch').default;
const Filter = require('bad-words'),
	filter = new Filter();
module.exports = {
	name: 'lyrics',
	description: '🎶 Get lyrics for the currently playing song',
	aliases: ['ly'],
	cooldown: 3,
	category: 'music',
	options: {},
	async execute(message) {

		const queue = message.client.queue.get(message.guild.id);

		if (!queue) {return await message.reply({ content: 'There is nothing playing.' });}

		let lyricsinfo;
		const msg = await message.reply(`Fetching lyrics for ${queue.songs[0].title}...`);
		try {
			lyricsinfo = await getLyrics(queue.songs[0].title);
			if (!lyricsinfo.lyrics) {lyricsinfo.lyrics = `No lyrics found for ${queue.songs[0].title}.`;}
		} catch (error) {
			lyricsinfo.lyrics = `No lyrics found for ${queue.songs[0].title}.`;
		}
		if (filter.clean(lyricsinfo.lyrics).includes('**')) {
			message.reply('⚠ Warning: This lyrics contains swears. We removed most of them from the lyrics');
		}
		const lyricsEmbed = new MessageEmbed()
			.setAuthor(`${lyricsinfo?.title ?? 'Unknown'} — Lyrics`, 'https://github.com/SudhanPlayz/Discord-MusicBot/raw/master/assets/logo.gif', queue.songs[0].url)
			.setThumbnail(lyricsinfo?.thumbnail ?? 'https://thumbs.dreamstime.com/b/music-note-icon-element-simple-web-name-mobile-concept-apps-thin-line-can-be-used-white-background-170192321.jpg')
			.setURL(lyricsinfo?.link ?? queue.songs[0].url)
			.setColor(message.channel.type === 'DM' ? color.bot_theme : message.guild.me.displayHexColor)
			.setDescription(filter.clean(lyricsinfo.lyrics))
			.setTimestamp()
			.setFooter(`Song by ${lyricsinfo?.author ?? 'Unknown'}`);
		if (lyricsEmbed.description.length >= 4093) {
			lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 	4093)}...`;
		} else {
			await msg.edit({ embeds: [lyricsEmbed] });
		}
	},
	async executeSlash(interaction) {

		const queue = interaction.client.queue.get(interaction.guild.id);

		if (!queue) {return await interaction.reply({ content: 'There is nothing playing.' });}

		let lyricsinfo;
		try {
			await interaction.deferReply();
			lyricsinfo = await getLyrics(queue.songs[0].title)
        ?? `No lyrics found for ${queue.songs[0].title}.`;
		} catch (error) {
			console.error(error);
			lyricsinfo = `No lyrics found for ${queue.songs[0].title}.`;
		}
		if (filter.clean(lyricsinfo.lyrics).includes('**')) {
			interaction.editReply('⚠ Warning: This lyrics contains swears. We removed most of them from the lyrics');
		}
		const lyricsEmbed = new MessageEmbed()
			.setAuthor(`${lyricsinfo?.title ?? 'Unknown'} — Lyrics`, 'https://github.com/SudhanPlayz/Discord-MusicBot/raw/master/assets/logo.gif', queue.songs[0].url)
			.setThumbnail(lyricsinfo?.thumbnail ?? 'https://thumbs.dreamstime.com/b/music-note-icon-element-simple-web-name-mobile-concept-apps-thin-line-can-be-used-white-background-170192321.jpg')
			.setURL(lyricsinfo?.link ?? queue.songs[0].url)
			.setColor(interaction.channel.type === 'DM' ? color.bot_theme : interaction.guild.me.displayHexColor)
			.setDescription(filter.clean(lyricsinfo.lyrics))
			.setTimestamp()
			.setFooter(`Song by ${lyricsinfo?.author ?? 'Unknown'}`);
		if (lyricsEmbed.description.length >= 4093) {
			lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 	4093)}...`;
		}
		await interaction.editReply({ embeds: [lyricsEmbed] }).catch(console.error);
	},
};
async function getLyrics(title) {
	const url = new URL('/lyrics', 'https://some-random-api.ml');

	url.searchParams.set('title', title);
	const res = await fetch(url);

	if (!res.ok) {
		throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
	}
	const json = await res.json();

	return { lyrics: json?.lyrics, title: json?.title, author: json?.author, thumbnail: json.thumbnail?.genius, link: json.links?.genius };
}