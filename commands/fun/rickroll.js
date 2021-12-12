const {
	createAudioPlayer,
	createAudioResource,
	entersState,
	getVoiceConnection,
	joinVoiceChannel,
	AudioPlayerStatus,
	NoSubscriberBehavior,
	VoiceConnectionStatus,
} = require('@discordjs/voice');
const ytdl = require('ytdl-core-discord');
const subscriptions = new Set();
module.exports = {
	name: 'rickroll',
	description: 'Rickroll the voice channel you\'re in! <a:rickroll:805174355797082132>',
	guildOnly: true,
	cooldown: 10,
	category: 'fun',
	clientpermissions: ['SPEAK', 'CONNECT'],
	options: {},
	async execute(message) {
		if (!message.member?.voice.channelId) {
			return await message.reply({ content: 'You need to join a voice channel to use this command.' });
		}
		const res = await getOrCreateConnection(message.member.voice.channel);

		if (!res.connection) {return await message.reply('VC Error: Connection Refused');}

		if (res.connection.joinConfig.channelId !== message.member.voice.channelId) {return await message.reply('I\'m still playing music in another channel');}

		if (res.player?.state.status === AudioPlayerStatus.Playing) {return await message.reply('It\'s rude to interrupt someone\'s music.');}

		const player = makePlayer();

		res.connection.subscribe(player);
		await entersState(player, AudioPlayerStatus.Playing, 20_000);
		await message.reply('Success');
	},
	async executeSlash(interaction) {
		// Only try to join the sender's voice channel if they are in one themselves
		// if (!interaction.client.options.intents.has("GUILD_VOICE_STATES"))
		// return await interaction.reply("I'm missing the Guild Voice States intent");

		if (!interaction.member?.voice.channelId) {
			return await interaction.reply({ content: 'You need to join a voice channel to use this command.' });
		}
		await interaction.deferReply({ ephemeral: true });
		const { connection } = await getOrCreateConnection(interaction.member.voice.channel);

		if (!connection) {return await interaction.editReply('VC Error: Connection Refused');}

		if (connection.joinConfig.channelId !== interaction.member.voice.channelId) {return await interaction.editReply('I\'m still playing music in another channel');}

		await interaction.editReply('Success');
	},
};
/** @param {import("discord.js").GuildChannel & { type: import("discord.js").VoiceBasedChannelTypes }} channel */
async function getOrCreateConnection(channel) {
	let connection = getVoiceConnection(channel.guild.id);
	if (!connection) {
		connection = joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guild.id,
			adapterCreator: channel.guild.voiceAdapterCreator,
		});
		await Promise.race([
			entersState(connection, VoiceConnectionStatus.Ready, 20_000),
			entersState(connection, VoiceConnectionStatus.Disconnected, 20_000),
		]);
		if (connection.state.status === VoiceConnectionStatus.Disconnected) {
			connection.destroy();

			return null;
		}
	}

	return {
		connection,
		/** @returns {AudioPlayer} */
		get player() {
			return connection.state.subscription?.player;
		},
	};
}
function makePlayer() {
	const player = createAudioPlayer({
		behaviors: {
			noSubscriber: NoSubscriberBehavior.Stop,
		},
	})
		.on('subscribe', subscription => {
			subscriptions.add(subscription);
			if (player.state.status !== AudioPlayerStatus.Idle) return;

			const resource = createAudioResource(ytdl('https://www.youtube.com/watch?v=dQw4w9WgXcQ'));

			player.play(resource);
		}).on('unsubscribe', subscription => {
			subscriptions.delete(subscription);
		}).on(AudioPlayerStatus.Idle, () => {
			for (const subscription of subscriptions) {subscription.connection.destroy();}
		});

	return player;
}