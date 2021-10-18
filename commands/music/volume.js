const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'volume',
	description: '🔈 Change the server song queue volume',
	usage: '[number]',
	aliases: ['v', 'vol'],
	guildOnly: true,
	cooldown: 3,
	category: 'music',
	options: {},
	async execute(message, args) {
		const channel = message.member.voice.channel;

		if (!channel) {return await message.reply({ content: 'I\'m sorry but you need to be in a voice channel to play music!' });}

		const serverQueue = message.client.queue.get(message.guild.id);

		if (!serverQueue) {return await message.reply({ content: 'There is nothing playing in this server.' });}

		if (!serverQueue.playing) {return await message.reply({ content: 'There is nothing playing in this server.' });}

		if (!args[0]) {return await message.reply({ content: `The current volume is: **${serverQueue.volume}**` });}

		const volume = Number.parseInt(args[0]);

		if (!volume) {return await message.reply({ content: ':notes: Numbers only!' });}

		if (volume > 150 || volume < 0) {return await message.reply({ content: 'You can\'t set the volume more than 150. or lower than 0' });}

		serverQueue.volume = volume;
		serverQueue.player.state.resource.volume.setVolumeLogarithmic(volume / 100);
		const xd = new MessageEmbed()
			.setDescription(`I have set the volume to: **${args[0]}/100**`)
			.setAuthor('Server Volume Manager', 'https://thumbs.gfycat.com/BlushingBrownLamb-max-1mb.gif')
			.setColor('BLUE');

		return message.reply({ embeds: [xd] });

	},
};