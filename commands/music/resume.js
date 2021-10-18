const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'resume',
	description: '▶ Resumes the current playing song',
	guildOnly: true,
	cooldown: 3,
	category: 'music',
	options: {},
	async execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);

		if (!serverQueue) {
			return await message.reply({
				embeds: [
					new MessageEmbed()
						.setColor('BLUE')
						.setDescription('The bot isn\'t connected to voice.'),
				],
			});
		}

		if (serverQueue.playing) {
			return await message.reply({
				embeds: [
					new MessageEmbed()
						.setColor('BLUE')
						.setDescription('The bot is already playing.'),
				],
			});
		}

		serverQueue.playing = true;
		serverQueue.player.unpause();

		return await message.reply({
			embeds: [
				new MessageEmbed()
					.setColor('GREEN')
					.setDescription('▶ Resumed the music for you!'),
			] });


	},
	async executeSlash(interaction) {
		const serverQueue = interaction.client.queue.get(interaction.guild.id);

		if (!serverQueue) {
			return await interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor('BLUE')
						.setDescription('The bot isn\'t connected to voice.'),
				],
			});
		}

		if (serverQueue.playing) {
			return await interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor('BLUE')
						.setDescription('The bot is already playing.'),
				],
			});
		}

		serverQueue.playing = true;
		serverQueue.player.unpause();

		return await interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor('GREEN')
					.setDescription('▶ Resumed the music for you!'),
			] });


	},
};