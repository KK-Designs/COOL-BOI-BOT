module.exports = {
	name: 'loop',
	description: '🔁 Toggle music loop',
	cooldown: 3,
	category: 'music',
	execute(message, args) {
		const { MessageEmbed } = require('discord.js');
		const serverQueue = message.client.queue.get(message.guild.id);
		if (serverQueue) {
			serverQueue.loop = !serverQueue.loop;
		}

		if (serverQueue.loop == true) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor('GREEN')
						.setDescription('🔁 Queue is now being looped'),
				], reply: { messageReference: message.id } });
		}
		else if (serverQueue.loop == false) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor('GREEN')
						.setDescription('Queue is now not being looped'),
				], reply: { messageReference: message.id } });
		}

	},
};