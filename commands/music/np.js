module.exports = {
	name: 'np',
	description: 'See the surrent dong playing.',
	cooldown: 5,
	guildOnly: true,
	category: 'music',
	aliases: ['nowplaying'],
	execute(message) {
		const { MessageEmbed } = require('discord.js');
		const humanizeDuration = require('humanize-duration');
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send('There is nothing playing.');
		const embed = new MessageEmbed()
			.setColor(message.guild.me.displayHexColor)
			.setTitle('Current Song playing')
			.addField('<:playing:813209288100151366> Now playing:', `${serverQueue.songs[0].title} • ${serverQueue.songs[0].author}`, true) // .addField(`Duration:`, serverQueue.songs.map(song => `${humanizeDuration(song.duration * 1000)}`), true)
			.addField('Duration:', `${humanizeDuration(serverQueue.songs[0].duration * 1000)}`, true)
			.setTimestamp()
			.setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true }));
		return message.channel.send({ embeds: [embed], reply: { messageReference: message.id } });
	},
};