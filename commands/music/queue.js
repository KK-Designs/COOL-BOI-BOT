module.exports = {
	name: 'queue',
	description: 'Veiw the server queue.',
	aliases: ['q'],
	guildOnly: true,
	cooldown: 1.5,
	category: 'music',
	execute(message, args) {
		const { MessageEmbed } = require('discord.js');
		const humanizeDuration = require('humanize-duration');
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send({ content: 'There is nothing playing.', reply: { messageReference: message.id } });

		if (args[0]) {

			if (args[0].toLowerCase() === 'raw_json') {
				message.client.queue.delete(message.guild.id);
				message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor('ORANGE')
							.setDescription(`\`\`\`\ ${JSON.stringify(serverQueue)} \`\`\``),
					], reply: { messageReference: message.id },
				});
			}

			if (args[0].toLowerCase() === 'clear') {
				message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor('GREEN')
							.setDescription(`${message.author} 🗑️ cleared \`${serverQueue.songs.length}\` songs`),
					], reply: { messageReference: message.id },
				});
				return message.client.queue.delete(message.guild.id);
			}

		}
		const embed = new MessageEmbed()
			.setColor(message.guild.me.displayHexColor)
			.setTitle(`Queue for ${message.guild.name}\n`)
			.setDescription(`${serverQueue.songs.map(song => `<:line:812833164103778344> **${song.title} | ${humanizeDuration(song.duration * 1000)}**`).join('\n')}`, '\u200b')
			.addField('Now playing:', `${serverQueue.songs[0].title} • ${serverQueue.songs[0].author}`, true)
			.setTimestamp()
			.setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true }));

		if (embed.description.length >= 4096) {
			embed.description = `${embed.description.substr(0, 4093)}...`;
		}

		message.channel.send({ embeds: [ embed ], reply: { messageReference: message.id } });
	},
};