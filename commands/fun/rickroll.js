module.exports = {
	name: 'rickroll',
	description:
		'Rickroll the voice channel you\'re in! <a:rickroll:805174355797082132>',
	guildOnly: true,
	cooldown: 10,
	category: 'fun',
	clientpermissions: ['SPEAK', 'CONNECT'],
	async execute(message, args) {
		const { joinVoiceChannel } = require('@discordjs/voice');
		// Only try to join the sender's voice channel if they are in one themselves
		if (!message.member.voice.channelId) {
			return message.channel.send({
				content: 'You need to join a voice channel to use this command.',
				reply: { messageReference: message.id },
			});
		}

		const connection = await joinVoiceChannel({
			channelId: message.member.voice.channelId,
			guildId: message.guild.id,
			adapterCreator: message.guild.voiceAdapterCreator,
		});
		// ReadableStreams, in this example YouTube audio
		const ytdl = require('ytdl-core');
		const { createAudioPlayer } = require('@discordjs/voice');
		const { createAudioResource } = require('@discordjs/voice');
		const player = createAudioPlayer();
		const resource = createAudioResource(
			ytdl('https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
		);
		player.play(resource);
		connection.subscribe(player);
	},
};
