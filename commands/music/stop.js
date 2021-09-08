module.exports = {
	name: 'stop',
	description: '🛑 Stop the current playing song',
	cooldown: 5,
	guildOnly: true,
	category: 'music',
	execute(message) {
		const { channel } = message.member.voice;
		if (!channel) return message.channel.send({ content: 'You need to be in a voice channel to do this.', reply: { messageReference: message.id } });
		channel.leave();
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send({ content: 'There is nothing playing that I could stop for you.', reply: { messageReference: message.id } });
		serverQueue.songs = [];
		try {
			serverQueue.connection.dispatcher.end('Stop command has been used!');
			message.channel.send({ content: 'Stopped playing songs' });
			message.client.queue.delete(message.guild.id);
		}
		catch (err) {
			channel.leave();
	  return message.client.queue.delete(message.guild.id);
		}
	},
};