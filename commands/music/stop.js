module.exports = {
	name: 'stop',
	description: '🛑 Stop the current playing song',
	cooldown: 5,
	guildOnly: true,
	category: 'music',
	options: {},
	async execute(message) {
		const { channel } = message.member.voice;

		if (!channel) {return await message.reply({ content: 'You need to be in a voice channel to do this.' });}

		const serverQueue = message.client.queue.get(message.guild.id);

		if (!serverQueue) {return await message.reply({ content: 'There is nothing playing that I could stop for you.' });}

		serverQueue.destroy();
		await message.channel.send({ content: 'Stopped playing songs' });
	},
	async executeSlash(interaction) {
		const { channel } = interaction.member.voice;

		if (!channel) {return await interaction.reply({ content: 'You need to be in a voice channel to do this.' });}

		const serverQueue = interaction.client.queue.get(interaction.guild.id);

		if (!serverQueue) {return await interaction.reply({ content: 'There is nothing playing that I could stop for you.' });}

		serverQueue.destroy();
		await interaction.reply({ content: 'Stopped playing songs' });
	},
};