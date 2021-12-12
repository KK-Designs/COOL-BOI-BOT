const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'loop',
	description: '🔁 Toggle music loop',
	cooldown: 3,
	category: 'music',
	options: {},
	async execute(message) {
		const queue = message.client.queue.get(message.guild.id);

		if (!queue) {return await message.reply({ content: 'There is nothing playing.' });}

		queue.loop = !queue.loop;
		if (queue.loop) {
			return await message.reply({
				embeds: [
					new MessageEmbed()
						.setColor('GREEN')
						.setDescription('🔁 Queue is now being looped'),
				] });
		}

		return await message.reply({
			embeds: [
				new MessageEmbed()
					.setColor('GREEN')
					.setDescription('Queue is now not being looped'),
			] });


	},
	async executeSlash(interaction) {
		const queue = interaction.client.queue.get(interaction.guild.id);

		if (!queue) {return await interaction.reply({ content: 'There is nothing playing.' });}

		queue.loop = !queue.loop;
		if (queue.loop) {
			return await interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor('GREEN')
						.setDescription('🔁 Queue is now being looped'),
				] });
		}

		return await interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor('GREEN')
					.setDescription('Queue is now not being looped'),
			] });


	},
};