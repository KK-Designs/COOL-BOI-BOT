module.exports = {
	name: 'pause',
	description: '<:pause:813209287881916447> Pause the current playing song',
	cooldown: 5,
	guildOnly: true,
	category: 'music',
	execute(message) {
		const { MessageEmbed } = require('discord.js');
		const serverQueue = message.client.queue.get(message.guild.id);
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return message.channel.send({ content: '<:pause:813209287881916447> Paused the music for you!', reply: { messageReference: message.id } });
		}
		return message.channel.send({ content: '<:no:803069123918823454> There is nothing playing.', reply: { messageReference: message.id } });
	},
};