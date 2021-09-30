const { MessageEmbed } = require('discord.js');
const color = require('../../color.json');
const fetch = require('node-fetch').default;
module.exports = {
	name: 'lyrics',
	description: '🎶 Get lyrics for the currently playing song',
	aliases: ['ly'],
	cooldown: 3,
	category: 'music',
	options: {},
	async execute(message) {

		const queue = message.client.queue.get(message.guild.id);

		if (!queue) {return message.reply({ content: 'There is nothing playing.' });}

		let lyrics;
		const msg = await message.channel.send(`Fetching lyrics for ${queue.songs[0].title}...`);
		try {
			// lyrics = await lyricsFinder(queue.songs[0].title, "");
			lyrics = await getLyrics(queue.songs[0].title);
			if (!lyrics) {lyrics = `No lyrics found for ${queue.songs[0].title}.`;}
		}
		catch (error) {
			lyrics = `No lyrics found for ${queue.songs[0].title}.`;
		}
		const lyricsEmbed = new MessageEmbed()
			.setAuthor(`${queue.songs[0].title} — Lyrics`, 'https://thumbs.gfycat.com/BlushingBrownLamb-max-1mb.gif', queue.songs[0].url)
			.setThumbnail(queue.songs[0].img)
			.setColor(message.guild?.me.displayHexColor ?? color.bot_theme)
			.setDescription(lyrics)
			.setTimestamp()
			.setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true }));
		if (lyricsEmbed.description.length >= 2048) {
			lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
		}
		else {
			await msg.edit({ embeds: [lyricsEmbed] });
		}

	},
	async executeSlash(interaction) {

		const queue = interaction.client.queue.get(interaction.guild.id);

		if (!queue) {return interaction.reply({ content: 'There is nothing playing.' });}

		let lyrics;
		try {
			await interaction.deferReply();
			lyrics = await getLyrics(queue.songs[0].title)
        ?? `No lyrics found for ${queue.songs[0].title}.`;
		}
		catch (error) {
			console.error(error);
			lyrics = `No lyrics found for ${queue.songs[0].title}.`;
		}
		const lyricsEmbed = new MessageEmbed()
			.setAuthor(`${queue.songs[0].title} — Lyrics`, 'https://thumbs.gfycat.com/BlushingBrownLamb-max-1mb.gif', queue.songs[0].url)
			.setThumbnail(queue.songs[0].img)
			.setColor(interaction.channel.type === 'DM' ? color.bot_theme : interaction.guild.me.displayHexColor)
			.setDescription(lyrics)
			.setTimestamp()
			.setFooter(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }));
		if (lyricsEmbed.description.length >= 2048) {
			lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
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

	return json.lyrics;
}