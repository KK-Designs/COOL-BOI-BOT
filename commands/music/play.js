const assert = require('assert/strict');
const { Util } = require('discord.js');
const { joinVoiceChannel, entersState, VoiceConnectionStatus, createAudioPlayer, AudioPlayerStatus, createAudioResource, getVoiceConnection, VoiceConnection } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const sendError = require('../../error.js');
// Use ytdl-core-discord instead
// const ytdl = require('ytdl-core-discord');
const yts = require('yt-search');
module.exports = {
	name: 'play',
	description: '<:music:813204224456261632> Play A song with the given youtube url',
	usage: '[song url or name]',
	aliases: ['p'],
	guildOnly: true,
	category: 'music',
	cooldown: 10,
	options: {
		song: {
			type: 'String',
			description: 'The name or youtube url of the song',
		},
	},
	/**
   * @param {import("discord.js").Message &  { client: { queue: import("discord.js").Collection<string, GuildQueue> }, channel: import("discord.js").TextChannel } } message
   * @param {string[]} args
   */
	async execute(message, args) {
		if (!args.length) {return await message.reply({ content: 'Please provide a youtube URL for me to play, or just put the name of the song' });}

		const { channel } = message.member.voice;

		if (!channel) {return await message.reply({ content: 'You need to join a a voice channel to use this command.' });}

		const permissions = channel.permissionsFor(message.client.user);

		if (!permissions.has('CONNECT')) {return await message.reply({ content: 'I cannot connect to your voice channel, make sure I have the proper permissions!' });}

		if (!permissions.has('SPEAK')) {return await message.reply({ content: 'I cannot speak in this voice channel, make sure I have the proper permissions!' });}

		const searchString = args.join(' ');
		const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
		const regex = new RegExp(videoPattern);
		let songReq;
		if (args[0].match(regex)) {
			const songInfo = await ytdl.getInfo(args[0].replace(/<(.+)>/g, '$1'));

			songReq = {
				id: songInfo.videoDetails.videoId,
				title: Util.escapeMarkdown(songInfo.videoDetails.title),
				duration: +songInfo.videoDetails.lengthSeconds,
				author: songInfo.videoDetails.ownerChannelName,
				url: songInfo.videoDetails.video_url,
			};
		}
		else {
			// message.reply('Please pass a valid youtube URL.');
			const searched = await yts.search(searchString);
			if (searched.videos.length === 0) {return await message.reply({ content: 'Looks like i was unable to find the song on YouTube' });}

			const video = searched.videos[0];
			songReq = {
				id: video.videoId,
				title: Util.escapeMarkdown(video.title),
				author: video.author.name,
				url: video.url,
				duration: video.duration.seconds,
			};

		}
		const serverQueue = message.client.queue.get(message.guild.id);

		if (serverQueue) {
			serverQueue.songs.push(songReq);
			return await message.reply({ content: `<:check:807305471282249738> **${songReq.title}** has been added to the queue!` });
		}
		const player = createAudioPlayer();
		const queueConstruct = new GuildQueue({ client: message.client, textChannel: message.channel, guildId: message.guildId });

		player.on(AudioPlayerStatus.Idle, async () => {
			if (queueConstruct.loop === true) {
				queueConstruct.songs.push(queueConstruct.songs.shift());
			}
			else {
				queueConstruct.songs.shift();
			}
			if (queueConstruct.songs[0]) {return void await queueConstruct.playNext();}

			queueConstruct.destroy();
			message.client.queue.delete(message.guild.id);
		}).on('error', error => {
			console.error(error);


			return sendError(`<:no:803069123918823454> An error occurred while playing music: ${error}`, message.channel);
		});
		message.client.queue.set(message.guild.id, queueConstruct);
		queueConstruct.songs.push(songReq);
		if (message.guild.me.voice.channelId) {
			const connection = getVoiceConnection(message.guild.id);

			connection.subscribe(player);
			queueConstruct.setConnection(connection);
			await queueConstruct.playNext();
			return;
		}
		try {
			await queueConstruct.connect(channel, player);
			await queueConstruct.playNext();
		}
		catch (error) {
			console.error(`Error: ${error}`);
			queueConstruct.destroy();

			return sendError(`<:no:803069123918823454> I could not join the voice channel: ${error}`, message.channel);
		}
	},
	async executeSlash(interaction) {
		const { channel } = interaction.member.voice;

		if (!channel) {return await interaction.reply({ content: 'You need to join a a voice channel to use this command.' });}

		const permissions = channel.permissionsFor(interaction.client.user);

		if (!permissions.has('CONNECT')) {return await interaction.reply({ content: 'I cannot connect to your voice channel, make sure I have the proper permissions!' });}

		if (!permissions.has('SPEAK')) {return await interaction.reply({ content: 'I cannot speak in this voice channel, make sure I have the proper permissions!' });}

		const searchString = interaction.options.getString('song', true);
		const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
		let songReq;
		if (videoPattern.test(searchString)) {
			const songInfo = await ytdl.getInfo(searchString.replace(/<(.+)>/g, '$1'));

			songReq = {
				id: songInfo.videoDetails.videoId,
				title: Util.escapeMarkdown(songInfo.videoDetails.title),
				duration: +songInfo.videoDetails.lengthSeconds,
				author: songInfo.videoDetails.ownerChannelName,
				url: songInfo.videoDetails.video_url,
			};
		}
		else {
			// message.reply('Please pass a valid youtube URL.');
			const searched = await yts.search(searchString);
			if (searched.videos.length === 0) {return await interaction.reply({ content: 'Looks like i was unable to find the song on YouTube' });}

			const video = searched.videos[0];

			songReq = {
				id: video.videoId,
				title: Util.escapeMarkdown(video.title),
				author: video.author.name,
				url: video.url,
				duration: video.duration.seconds,
			};

		}
		const serverQueue = interaction.client.queue.get(interaction.guild.id);

		if (serverQueue) {
			serverQueue.songs.push(songReq);
			return await interaction.reply({ content: `<:check:807305471282249738> **${songReq.title}** has been added to the queue!` });
		}
		const player = createAudioPlayer();
		const queueConstruct = new GuildQueue({
			client: interaction.client,
			textChannel: interaction.channel,
			guildId: interaction.guildId,
		});
		interaction.client.queue.set(interaction.guild.id, queueConstruct);
		queueConstruct.songs.push(songReq);
		if (interaction.guild.me.voice.channelId) {
			const connection = getVoiceConnection(interaction.guild.id);

			connection.subscribe(player);
			queueConstruct.setConnection(connection);
			await queueConstruct.playNext();
			return;
		}
		try {
			await queueConstruct.connect(channel, player);
			await queueConstruct.playNext();
		}
		catch (error) {
			console.error(`Error: ${error}`);
			queueConstruct.destroy();

			return await interaction.reply(`<:no:803069123918823454> I could not join the voice channel: ${error}`);
		}
	},
};

class GuildQueue {
	/**
   * @param {Object} options
   * @param {import("discord.js").Client<true> & { queue: Map<string, GuildQueue> } } options.client
   * @param {import("discord.js").TextChannel} options.textChannel
   * @param {string} options.guildId
  */
	constructor({ client, textChannel, guildId }) {
		this.id = guildId;
		this.client = client;
		this.songs = [];
		this.connection = null;
		this.textChannel = textChannel;
		this.volume = 50;
		this.loop = false;
		this.paused = false;
	}
	get player() {
		if (!this.connection) {return null;}
		if (this.connection.state.status === VoiceConnectionStatus.Destroyed) {return null;};

		return this.connection.state.subscription.player;
	}
	/**
   * @param {import("discord.js").BaseGuildVoiceChannel} channel
   * @param {import("@discordjs/voice").AudioPlayer} player
   */
	async connect(channel, player) {
		assert(this.id === channel.guildId);
		const connection = joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guildId,
			adapterCreator: channel.guild.voiceAdapterCreator,
			selfDeaf: true,
		});
		await Promise.race([
			entersState(connection, VoiceConnectionStatus.Connecting, 5000),
			entersState(connection, VoiceConnectionStatus.Disconnected, 5000),
		]);
		// Most likely missing VC perm
		if (connection.state.status === VoiceConnectionStatus.Disconnected) {
			connection.destroy();
			throw new Error('Connection Refused');
		}

		console.log('VConn Status: Connecting');
		await entersState(connection, VoiceConnectionStatus.Ready, 5000);
		console.log('VConn Status: Ready');
		connection.subscribe(player);
		this.setConnection(connection);
	}
	/**
   * @param {VoiceConnection} connection
   */
	setConnection(connection) {
		assert(connection.state.status === VoiceConnectionStatus.Ready, new Error('Connection isn\'t ready'));
		assert(connection.state.subscription, new Error('Player isn\'t subscribed'));
		this.bindConnectionEvents(connection);
		this.bindPlayerEvents(connection.state.subscription.player);
		this.connection = connection;
	}
	async play(song) {
		console.log('Now playing %s (%s)', song.title, song.url);
		const stream = ytdl(song.url, { filter: 'audioonly', highWaterMark: 32 });
		stream.on('aborted', async arg => {
			console.log('Abort was called', arg);

			await this.textChannel.send('Stream was aborted');
		});
		const resource = createAudioResource(stream, { inlineVolume: true });

		// resource.volume.setVolumeLogarithmic(this.volume / 100);
		this.player.play(resource);

		await this.textChannel.send({ content: `<:music:813204224456261632> Start playing: **${song.title}**` });
	}
	playNext() {
		return this.play(this.songs[0]);
	}
	destroy(force = false) {
		console.log('Destroy function was called');
		if (!this.connection) {return console.log('There was no connection to detroy');}
		if (this.connection && this.connection.state.status !== VoiceConnectionStatus.Destroyed) {
			console.log('Destroying Connection');
		  this.connection.destroy();
			this.connection = null;
		}
		if (this.player && this.player.state.status !== AudioPlayerStatus.Idle) {
			console.log('Stopping player');
			this.player.stop(force);
		}
	}
	bindConnectionEvents(connection = this.connection) {
		connection.on('stateChange', (oldState, newState) => {
			console.log(`[VoiceConn] State change: ${oldState.status} -> ${newState.status}`);
		});
		connection.on(VoiceConnectionStatus.Destroyed, () => {
			console.log('Connection destroyed');
			console.log(new Error().stack.replaceAll(process.cwd(), '.'));
			this.client.queue.delete(this.id);
		});
		connection.on('error', error => {
			console.error(error);
			this.textChannel.send(`An error occurred in the voice connection: ${error.message}`);
		});
	}
	bindPlayerEvents(player = this.player) {
		player.on('error', async error => {
			console.error(error);

			await this.textChannel.send(`An error has occurred in the player: ${error.message}`);
		});
		player.on('stateChange', (oldState, newState) => {
			console.log(`[AudioPlayer] State change: ${oldState.status} -> ${newState.status}`);
		});
		player.on(AudioPlayerStatus.Idle, async () => {
			this.playing = false;
			this.songs.shift();
			if (this.songs.length === 0) {
				console.log('No more songs left, destroying connection...');
				return this.destroy();
			}
			console.log('Playing next song, %d remaining', this.songs.length);
			this.playNext();
		});
		player.on(AudioPlayerStatus.Playing, () => {
			this.playing = false;
		});
	}
}