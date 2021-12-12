const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'volume',
	description: '🔈 Change the server song queue volume',
	usage: '[number]',
	aliases: ['v', 'vol'],
	guildOnly: true,
	cooldown: 3,
	category: 'music',
	options: {
		volume: {
			type: 'Integer',
			description: 'The volume to set the player to',
			required: false,
		},
	},
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
			.setAuthor('Server Volume Manager', 'https://github.com/SudhanPlayz/Discord-MusicBot/raw/master/assets/logo.gif')
			.setColor('BLUE');

		return await message.reply({ embeds: [xd] });
	},
	async executeSlash(interaction) {
		const channel = interaction.member.voice.channel;

		if (!channel) {return await interaction.reply({ content: 'I\'m sorry but you need to be in a voice channel to play music!' });}

		const serverQueue = interaction.client.queue.get(interaction.guild.id);

		if (!serverQueue) {return await interaction.reply({ content: 'There is nothing playing in this server.' });}

		if (!serverQueue.playing) {return await interaction.reply({ content: 'There is nothing playing in this server.' });}

		const volume = interaction.options.getInteger('volume');
		if (typeof volume !== 'number') {return await interaction.reply({ content: `The current volume is: **${serverQueue.volume}**` });}

		if (!volume) {return await interaction.reply({ content: ':notes: Numbers only!' });}

		if (volume > 150 || volume < 0) {return await interaction.reply({ content: 'You can\'t set the volume more than 150. or lower than 0' });}

		serverQueue.volume = volume;
		serverQueue.player.state.resource.volume.setVolumeLogarithmic(volume / 100);
		const xd = new MessageEmbed()
			.setDescription(`I have set the volume to: **${volume}/100**`)
			.setAuthor('Server Volume Manager', 'https://thumbs.gfycat.com/BlushingBrownLamb-max-1mb.gif')
			.setColor('BLUE');

		return await interaction.reply({ embeds: [xd] });
	},
};