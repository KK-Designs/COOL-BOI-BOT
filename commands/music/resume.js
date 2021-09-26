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
			return message.reply({
				embeds: [
					new MessageEmbed()
						.setColor('BLUE')
						.setDescription('The bot isn\'t connected to voice.'),
				],
			});
		}

		if (serverQueue.playing) {
			return message.reply({
				embeds: [
					new MessageEmbed()
						.setColor('BLUE')
						.setDescription('The bot is already playing.'),
				],
			});
		}

		serverQueue.playing = true;
		serverQueue.player.unpause();

		return message.reply({
			embeds: [
				new MessageEmbed()
					.setColor('GREEN')
					.setDescription('▶ Resumed the music for you!'),
			] });


	},
};