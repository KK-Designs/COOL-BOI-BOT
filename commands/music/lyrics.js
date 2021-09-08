module.exports = {
	name: 'lyrics',
	description: '🎶 Get lyrics for the currently playing song',
	aliases: ['ly'],
	cooldown: 3,
	category: 'music',
	async execute(message, args) {
		const { MessageEmbed } = require('discord.js');
		const color = require('../../color.json');
		const solenolyrics = require('solenolyrics');

		const queue = message.client.queue.get(message.guild.id);
		if (!queue) return message.channel.send({ content: 'There is nothing playing.', reply: { messageReference: message.id } }).catch(console.error);

		let lyrics;
		let msg;

		try {
			msg = await message.channel.send(`<a:loading:808390866367545384> Fetching lyrics for ${queue.songs[0].title}...`);
			lyrics = await solenolyrics.requestLyricsFor(queue.songs[0].title);
			if (!lyrics) lyrics = `No lyrics found for ${queue.songs[0].title}.`;
		}
		catch (error) {
			lyrics = `No lyrics found for ${queue.songs[0].title}.`;
		}

		const lyricsEmbed = new MessageEmbed()
			.setAuthor(`${queue.songs[0].title} — Lyrics`, 'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif', queue.songs[0].url)
			.setThumbnail(queue.songs[0].img)
			.setColor(message.channel.type === 'dm' ? color.bot_theme : message.guild.me.displayHexColor)
			.setDescription(lyrics)
			.setTimestamp()
			.setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true }));

		if (lyricsEmbed.description.length >= 2048) {
			lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
		}
		else {
			message.channel.send({ embeds: [lyricsEmbed], reply: { messageReference: message.id } }).catch(console.error);
			msg.delete();
		}

	},
};