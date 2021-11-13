const assert = require('assert/strict');
const { Util } = require('discord.js');
const { joinVoiceChannel, entersState, VoiceConnectionStatus, createAudioPlayer, AudioPlayerStatus, createAudioResource, getVoiceConnection, VoiceConnection } = require('@discordjs/voice');
const pdl = require('play-dl');
const { YouTubeVideo } = require('play-dl/dist/YouTube/classes/Video');
const sendError = require('../../error.js');
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

		let result;
		try {
			result = await getSongs(searchString);
		} catch (e) {
			if (e.message === 'The provided url type is not supported') {
				return await message.reply(`${e.message}`);
			}

			throw e;
		}
		if (result.songs.length === 0) {
			return await message.reply('Looks like i was unable to find the song on YouTube');
		}
		const serverQueue = message.client.queue.get(message.guild.id);

		if (serverQueue) {
			serverQueue.songs.push(...result.songs);
			if (result.songs.length === 1) {
			  return await message.reply({ content: `<:check:807305471282249738> **${result.songs[0].title}** has been added to the queue!` });
			}

			return await message.reply({ content: `<:check:807305471282249738> **${result.songs.length} songs** from the **${result.playlist.title ?? 'Untitled'}** playlist has been added to the queue!` });
		}
		const player = createAudioPlayer();
		const queueConstruct = new GuildQueue({ client: message.client, textChannel: message.channel, guildId: message.guildId });

		message.client.queue.set(message.guild.id, queueConstruct);
		queueConstruct.songs.push(...result.songs);
		if (message.guild.me.voice.channelId) {
			const connection = getVoiceConnection(message.guild.id);

			connection.subscribe(player);
			queueConstruct.setConnection(connection);
			await queueConstruct.playNext();
			return await message.reply({ content: `<:check:807305471282249738> **${result.songs[0].title}** has been added to the queue!` });
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
	/**
   * @param {import("discord.js").CommandInteraction & import("discord.js").BaseGuildCommandInteraction<"cached"> & { client: { queue: import("discord.js").Collection<string, GuildQueue> }, channel: import("discord.js").TextChannel } } interaction
   */
	async executeSlash(interaction) {
		const { channel } = interaction.member.voice;

		if (!channel) {return await interaction.reply({ content: 'You need to join a a voice channel to use this command.' });}

		const permissions = channel.permissionsFor(interaction.client.user);

		if (!permissions.has('CONNECT')) {return await interaction.reply({ content: 'I cannot connect to your voice channel, make sure I have the proper permissions!' });}

		if (!permissions.has('SPEAK')) {return await interaction.reply({ content: 'I cannot speak in this voice channel, make sure I have the proper permissions!' });}

		const searchString = interaction.options.getString('song', true);
		let result;
		try {
			result = await getSongs(searchString);
		} catch (e) {
			if (e.message === 'The provided url type is not supported') {
				return await interaction.reply(`${e.message}`);
			}

			throw e;
		}
		if (result.songs.length === 0) {
			return await interaction.reply('Looks like i was unable to find the song on YouTube');
		}
		const serverQueue = interaction.client.queue.get(interaction.guild.id);

		if (serverQueue) {
			serverQueue.songs.push(...result.songs);

			return await interaction.reply({ content: `<:check:807305471282249738> **${result.songs[0].title}** has been added to the queue!` });
		}
		const player = createAudioPlayer();
		const queueConstruct = new GuildQueue({
			client: interaction.client,
			textChannel: interaction.channel,
			guildId: interaction.guildId,
		});
		interaction.client.queue.set(interaction.guild.id, queueConstruct);
		queueConstruct.songs.push(...result.songs);
		await interaction.deferReply({ ephemeral: true });
		if (interaction.guild.me.voice.channelId) {
			const connection = getVoiceConnection(interaction.guild.id);

			connection.subscribe(player);
			queueConstruct.setConnection(connection);
			await queueConstruct.playNext();
			return await interaction.editReply({ content: `<:check:807305471282249738> **${result.songs[0].title}** has been added to the queue!` });
		}
		try {
			await queueConstruct.connect(channel, player);
			await queueConstruct.playNext();
		}
		catch (error) {
			console.error(`Error: ${error}`);
			queueConstruct.destroy();

			return await interaction.editReply(`<:no:803069123918823454> I could not join the voice channel: ${error}`);
		}
		await interaction.editReply('Successfully started playing music');
	},
};
class Song {
	constructor({ id, title, author, url, duration }) {
		assert.strictEqual(typeof id, 'string');
		assert.strictEqual(typeof title, 'string');
		assert.strictEqual(typeof author, 'string');
		assert.strictEqual(typeof url, 'string');
		assert.strictEqual(typeof duration, 'number');

		this.id = id,
		this.title = Util.escapeMarkdown(title);
		this.author = author;
		this.url = url;
		this.duration = duration;
	}
	static create(data) {
		if (data instanceof YouTubeVideo) {
			return new Song({
				id: data.id,
				title: data.title,
				author: data.channel.name,
				url: data.url,
				duration: data.durationInSec,
			});
		}

		throw new Error('Unknown data, received ' + data.constructor?.name ?? data);
	}
}
/**
 * @param {string} query
 * @returns { Promise<{ songs: Song[], playlist?: import("play-dl/dist/YouTube/classes/Playlist").YouTubePlayList }> }
 */
async function getSongs(query) {
	const type = await pdl.validate(query);
	switch (type) {
	case 'yt_playlist': {
		const playlist = await pdl.playlist_info(query);

		return {
			playlist: playlist,
			songs: playlist.page(1).map(song => Song.create(song)),
		};
	}
	case 'yt_video': {
		const song = await pdl.video_info(query);

		return {
			songs: [Song.create(song)],
		};
	}
	case 'so_playlist':
	case 'so_track':
	case 'sp_album':
	case 'sp_playlist':
	case 'sp_track':
		throw new Error('The provided url type is not supported');

	default: {
		const results = await pdl.search(query, { limit: 1, source: { youtube: 'video' } });
		const song = results[0];

		return {
			songs: [Song.create(song)],
		};
	}
	}
}
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
		/** @type {Song[]} */
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
		const output = await pdl.stream(song.url);
		const resource = createAudioResource(output.stream, { inputType: output.type, inlineVolume: true });

		resource.volume.setVolumeLogarithmic(this.volume / 100);
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