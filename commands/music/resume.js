module.exports = {
	name: 'resume',
	description: '▶ Resumes the current playing song',
	guildOnly: true,
	cooldown: 3,
	category: 'music',
	execute(message) {
		const { MessageEmbed } = require('discord.js');
		const serverQueue = message.client.queue.get(message.guild.id);
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return message.channel.send({
				embeds: [
				  new MessageEmbed()
				  .setColor('GREEN')
				  .setDescription('▶ Resumed the music for you!'),
			  ], reply: { messageReference: message.id } });
		}
		return message.channel.send({
			embeds: [
			  new MessageEmbed()
			  .setColor('BLUE')
			  .setDescription('There is nothing playing.'),
		  ], reply: { messageReference: message.id } });
	},
};