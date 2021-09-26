module.exports = {
	name: 'pause',
	description: '<:pause:813209287881916447> Pause the current playing song',
	cooldown: 5,
	guildOnly: true,
	category: 'music',
	options: {},
	async execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);

		if (!serverQueue?.playing) {return message.reply({ content: '<:no:803069123918823454> There is nothing playing.' });}

		serverQueue.playing = false;
		serverQueue.player.pause();

		return message.reply({ content: '<:pause:813209287881916447> Paused the music for you!' });

	},
	async executeSlash(interaction) {
		const serverQueue = interaction.client.queue.get(interaction.guild.id);

		if (!serverQueue?.playing) {return await interaction.reply({ content: '<:no:803069123918823454> There is nothing playing.' });}

		serverQueue.playing = false;
		serverQueue.player.pause();

		return await interaction.reply({ content: '<:pause:813209287881916447> Paused the music for you!' });

	},
};