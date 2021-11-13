const { MessageEmbed } = require('discord.js');
const sendError = require('../../error.js');
module.exports = {
	name: 'skipto',
	description: 'Skip to the specified song in the queue!',
	usage: '[number]',
	aliases: ['st'],
	guildOnly: true,
	cooldown: 3,
	category: 'music',
	options: {
		number: {
			type: 'Integer',
			description: 'The number of the song to skip to',
		},
	},
	async execute(message, args) {
		const serverQueue = message.client.queue.get(message.guild.id);

		if (!serverQueue) {return await message.reply({ content: 'There is nothing playing that I could skip for you.' });}

		const queue = message.client.queue.get(message.guild.id);

		if (args[0] > queue.songs.length) {return await message.reply({ content: `The queue has only ${queue.songs.length} songs long!` }).catch(console.error);}

		queue.playing = true;
		if (queue.loop) {
			for (let i = 0; i < args[0] - 2; i++) {
				queue.songs.push(queue.songs.shift());
			}
		}
		else {
			queue.songs = queue.songs.slice(args[0] - 2);
		}
		try {
			queue.connection.dispatcher.end();
		}
		catch (error) {
			queue.voiceChannel.leave();
			message.client.queue.delete(message.guild.id);

			return sendError(`:notes: The player has stopped and the queue has been cleared.: ${error}`, message.channel);
		}
		queue.textChannel.send({
			embeds: [
				new MessageEmbed()
					.setColor('GREEN')
					.setDescription(`${message.author} ⏭ skipped \`${args[0] - 1}\` songs`),
			], reply: { messageReference: message.id },
		}).catch(console.error);

	},
	async executeSlash(interaction) {
		const serverQueue = interaction.client.queue.get(interaction.guild.id);

		if (!serverQueue) {return await interaction.reply({ content: 'There is nothing playing that I could skip for you.' });}

		const queue = interaction.client.queue.get(interaction.guild.id);
		const number = interaction.options.getInteger('number', true);
		if (number > queue.songs.length) {return await interaction.channel.send({ content: `The queue has only ${queue.songs.length} songs long!` }).catch(console.error);}

		queue.playing = true;
		if (queue.loop) {
			for (let i = 0; i < number - 2; i++) {
				queue.songs.push(queue.songs.shift());
			}
		}
		else {
			queue.songs = queue.songs.slice(number - 2);
		}
		queue.player.stop();
		await interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor('GREEN')
					.setDescription(`${interaction.author} ⏭ skipped \`${number - 1}\` songs`),
			],
		});

	},
};