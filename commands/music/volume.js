const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'volume',
	description: '🔈 Change the server song queue volume',
	usage: '[number]',
	aliases: ['v', 'vol'],
	guildOnly: true,
	cooldown: 3,
	category: 'music',
	async execute(message, args) {
		const channel = message.member.voice.channel;
		if (!channel) {
			return message.channel.send({
				content:
					'I\'m sorry but you need to be in a voice channel to play music!',
				reply: { messageReference: message.id },
			});
		}
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) {
			return message.channel.send({
				content: 'There is nothing playing in this server.',
				reply: { messageReference: message.id },
			});
		}
		if (!serverQueue.connection) {
			return message.channel.send({
				content: 'There is nothing playing in this server.',
				reply: { messageReference: message.id },
			});
		}
		if (!args[0]) {
			return message.channel.send({
				content: `The current volume is: **${serverQueue.volume}**`,
				reply: { messageReference: message.id },
			});
		}
		if (isNaN(args[0])) {
			return message.channel
				.send({
					content: ':notes: Numbers only!',
					reply: { messageReference: message.id },
				})
				.catch((err) => console.log(err));
		}
		if (parseInt(args[0]) > 150 || args[0] < 0) {
			return message.channel
				.send({
					content: 'You can\'t set the volume more than 150. or lower than 0',
					reply: { messageReference: message.id },
				})
				.catch((err) => console.log(err));
		}
		serverQueue.volume = args[0];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);
		const xd = new MessageEmbed()
			.setDescription(`I have set the volume to: **${args[0] / 1}/100**`)
			.setAuthor(
				'Server Volume Manager',
				'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif',
			)
			.setColor('BLUE');
		return message.channel.send({
			embeds: [xd],
			reply: { messageReference: message.id },
		});
	},
};
