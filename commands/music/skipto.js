module.exports = {
	name: 'skipto',
	description: 'Skip to the specified song in the queue!',
	usage: '[number]',
	aliases: ['st'],
	guildOnly: true,
	cooldown: 3,
	category: 'music',
	execute(message, args) {
		const { MessageEmbed } = require('discord.js');
		const sendError = require('../../error.js');
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) {
			return message.channel.send({
				content: 'There is nothing playing that I could skip for you.',
				reply: { messageReference: message.id },
			});
		}
		const queue = message.client.queue.get(message.guild.id);
		if (args[0] > queue.songs.length) {
			return message.channel
				.send({
					content: `The queue has only ${queue.songs.length} songs long!`,
				})
				.catch(console.error);
		}

		queue.playing = true;

		if (queue.loop) {
			for (let i = 0; i < args[0] - 2; i++) {
				queue.songs.push(queue.songs.shift());
			}
		}
		else {
			queue.songs = queue.songs.slice(args[0] - 2);
		}

		try {
			queue.connection.dispatcher.end();
		}
		catch (error) {
			queue.voiceChannel.leave();
			message.client.queue.delete(message.guild.id);
			return sendError(
				`:notes: The player has stopped and the queue has been cleared.: ${error}`,
				message.channel,
			);
		}

		queue.textChannel
			.send({
				embeds: [
					new MessageEmbed()
						.setColor('GREEN')
						.setDescription(
							`${message.author} ⏭ skipped \`${args[0] - 1}\` songs`,
						),
				],
				reply: { messageReference: message.id },
			})
			.catch(console.error);
	},
};
