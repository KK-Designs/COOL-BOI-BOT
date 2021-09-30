module.exports = {
	name: 'skip',
	description: 'Skip to the next song in the queue!',
	guildOnly: true,
	cooldown: 3,
	category: 'music',
	options: {},
	async execute(message) {
		const { channel } = message.member.voice;

		if (!channel) {return message.reply({ content: 'I\'m sorry but you need to be in a voice channel to play music!' });}

		const serverQueue = message.client.queue.get(message.guild.id);

		if (!serverQueue) {return message.reply({ content: 'There is nothing playing that I could skip for you.' });}

		serverQueue.player.stop();
		message.reply({ content: 'Skiped to the next song in queue!' });
	},
};