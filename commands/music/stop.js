module.exports = {
	name: 'stop',
	description: '🛑 Stop the current playing song',
	cooldown: 5,
	guildOnly: true,
	category: 'music',
	options: {},
	async execute(message) {
		const { channel } = message.member.voice;

		if (!channel) {return message.reply({ content: 'You need to be in a voice channel to do this.' });}

		const serverQueue = message.client.queue.get(message.guild.id);

		if (!serverQueue) {return message.reply({ content: 'There is nothing playing that I could stop for you.' });}

		serverQueue.songs = [];
		try {
			serverQueue.connection.dispatcher.end('Stop command has been used!');
			await message.channel.send({ content: 'Stopped playing songs' });
			message.client.queue.delete(message.guild.id);
		}
		catch (err) {
			console.error(err);
			serverQueue.destroy();

			return message.client.queue.delete(message.guild.id);
		}
	},
};