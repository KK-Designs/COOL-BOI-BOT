const { Util } = require('discord.js');
const { joinVoiceChannel, entersState, VoiceConnectionStatus, createAudioPlayer, AudioPlayerStatus, createAudioResource, getVoiceConnection } = require('@discordjs/voice');
// const ytdl = require('ytdl-core');
// Use ytdl-core-discord instead
const ytdl = require('ytdl-core-discord');
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
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   */
	async execute(message, args) {
		const sendError = require('../../error.js');

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
		const queueConstruct = {
			player,
			textChannel: message.channel,
			voiceChannel: channel,
			/** @type {VoiceConnection} */
			connection: null,
			songs: [],
			volume: 50,
			playing: true,
			loop: false,
			async play(song) {
				const stream = await ytdl(song.url);
				const resource = createAudioResource(stream, { inlineVolume: true });

				resource.volume.setVolumeLogarithmic(queueConstruct.volume / 100);
				this.player.play(resource);

				return this.textChannel.send({ content: `<:music:813204224456261632> Start playing: **${song.title}**` });
			},
			playNext() {
				return this.play(this.songs[0]);
			},
			destroy() {
				message.client.queue.delete(message.guild.id);
				this.player.stop(true);
				this.connection?.destroy();
			},
		};

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
			queueConstruct.connection = connection;
			queueConstruct.playNext();
			return;
		}
		try {
			const connection = joinVoiceChannel({
				channelId: channel.id,
				guildId: channel.guildId,
				adapterCreator: channel.guild.voiceAdapterCreator,
			});

			await Promise.race([
				entersState(connection, VoiceConnectionStatus.Connecting, 5000),
				entersState(connection, VoiceConnectionStatus.Disconnected, 5000),
			]);
			// Most likely missing VC perm
			if (connection.state.status === VoiceConnectionStatus.Disconnected) {throw new Error('Connection Refused');}

			console.log('VConn Status: Connecting');
			await entersState(connection, VoiceConnectionStatus.Ready, 5000);
			console.log('VConn Status: Ready');
			connection.subscribe(player);
			queueConstruct.connection = connection;
			queueConstruct.playNext();
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
		const regex = new RegExp(videoPattern);
		let songReq;
		if (searchString.match(regex)) {
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
		const queueConstruct = {
			player,
			textChannel: interaction.channel,
			voiceChannel: channel,
			/** @type {import("@discordjs/voice").VoiceConnection} */
			connection: null,
			songs: [],
			volume: 50,
			playing: true,
			loop: false,
			async play(song) {
				const stream = await ytdl(song.url);
				stream.on('abort', error => {
					console.error('Aborted', error);
				});
				const resource = createAudioResource(stream, { inlineVolume: true });

				resource.volume.setVolumeLogarithmic(queueConstruct.volume / 100);
				this.player.play(resource);

				return this.textChannel.send({ content: `<:music:813204224456261632> Start playing: **${song.title}**` });
			},
			playNext() {
				return this.play(this.songs[0]);
			},
			destroy() {
				interaction.client.queue.delete(interaction.guild.id);
				this.player.stop(true);
				this.connection?.destroy();
			},
		};

		player.on(AudioPlayerStatus.Idle, async () => {
			if (queueConstruct.loop === true) {
				queueConstruct.songs.push(queueConstruct.songs.shift());
			}
			else {
				queueConstruct.songs.shift();
			}
			if (queueConstruct.songs[0]) {return void await queueConstruct.playNext();}

			queueConstruct.destroy();
			interaction.client.queue.delete(interaction.guild.id);
		}).on('error', async error => {
			console.error(error);

			return await interaction.channel.send(`<:no:803069123918823454> An error occurred while playing music: ${error}`);
		});
		interaction.client.queue.set(interaction.guild.id, queueConstruct);
		queueConstruct.songs.push(songReq);
		if (interaction.guild.me.voice.channelId) {
			const connection = getVoiceConnection(interaction.guild.id);

			connection.subscribe(player);
			queueConstruct.connection = connection;
			queueConstruct.playNext();
			return;
		}
		try {
			const connection = joinVoiceChannel({
				channelId: channel.id,
				guildId: channel.guildId,
				adapterCreator: channel.guild.voiceAdapterCreator,
			});
			connection.on(VoiceConnectionStatus.Destroyed, () => {
				console.log(new Error().stack.replaceAll(process.cwd(), '.'));
			});
			connection.on('stateChange', (oldState, newState) => {
				console.log(`[VoiceConn] State change: ${oldState.status} => ${newState.status}`);
			});
			connection.on('error', error => {
				console.error(error);
			});

			await Promise.race([
				entersState(connection, VoiceConnectionStatus.Connecting, 5000),
				entersState(connection, VoiceConnectionStatus.Disconnected, 5000),
			]);
			// Most likely missing VC perm
			if (connection.state.status === VoiceConnectionStatus.Disconnected) {throw new Error('Connection Refused');}

			console.log('VConn Status: Connecting');
			await entersState(connection, VoiceConnectionStatus.Ready, 5000);
			console.log('VConn Status: Ready');
			connection.subscribe(player);
			queueConstruct.connection = connection;
			queueConstruct.playNext();
		}
		catch (error) {
			console.error(`Error: ${error}`);
			queueConstruct.destroy();

			return await interaction.reply(`<:no:803069123918823454> I could not join the voice channel: ${error}`);
		}
	},
};