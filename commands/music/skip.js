module.exports = {
	name: 'skip',
	description: 'Skip to the next song in the queue!',
	guildOnly: true,
	cooldown: 3,
	category: 'music',
	execute(message) {
		const { MessageEmbed } = require('discord.js');
		const { channel } = message.member.voice;
		if (!channel) {
			return message.channel.send({
				content:
					'I\'m sorry but you need to be in a voice channel to play music!',
				reply: { messageReference: message.id },
			});
		}
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) {
			return message.channel.send({
				content: 'There is nothing playing that I could skip for you.',
				reply: { messageReference: message.id },
			});
		}
		serverQueue.connection.dispatcher.end('Skip command has been used!');
		message.channel.send({
			content: 'Skiped to the next song in queue!',
			reply: { messageReference: message.id },
		});
	},
};
