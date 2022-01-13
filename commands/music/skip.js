module.exports = {
	name: 'skip',
	description: 'Skip to the next song in the queue!',
	guildOnly: true,
	cooldown: 3,
	category: 'music',
	options: {},
	async execute(message) {
		const { channel } = message.member.voice;

		if (!channel) {return await message.reply({ content: 'I\'m sorry but you need to be in a voice channel to play music!' });}

		const serverQueue = message.client.queue.get(message.guild.id);

		if (!serverQueue) {return await message.reply({ content: 'There is nothing playing that I could skip for you.' });}

		serverQueue.player.stop();
		await message.reply({ content: 'Skiped to the next song in queue!' });
	},
	async executeSlash(interaction) {
		const { channel } = interaction.member.voice;

		if (!channel) {return await interaction.reply({ content: 'I\'m sorry but you need to be in a voice channel to play music!' });}

		const serverQueue = interaction.client.queue.get(interaction.guild.id);

		if (!serverQueue) {return await interaction.reply({ content: 'There is nothing playing that I could skip for you.' });}

		serverQueue.player.stop();
		await interaction.reply({ content: 'Skiped to the next song in queue!' });
	},
};
