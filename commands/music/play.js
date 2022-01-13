const { Util } = require('discord.js');
const ytdl = require('ytdl-core');
const yts = require('yt-search');

module.exports = {
	name: 'play',
	description:
		'<:music:813204224456261632> Play a song with the given youtube url',
	usage: '[song url or name]',
	aliases: ['p'],
	guildOnly: true,
	category: 'music',
	cooldown: 10,
	async execute(message, args) {
		const sendError = require('../../error.js');
		if (!args.length) {
			return message.channel.send({
				content:
					'Please provide a youtube URL for me to play, or just put the name of the song',
				reply: { messageReference: message.id },
			});
		}
		const { channel } = message.member.voice;
		if (!channel) {
			return message.channel.send({
				content: 'You need to join a a voice channel to use this command.',
				reply: { messageReference: message.id },
			});
		}
		const permissions = channel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT')) {
			return message.channel.send({
				content:
					'I cannot connect to your voice channel, make sure I have the proper permissions!',
				reply: { messageReference: message.id },
			});
		}
		if (!permissions.has('SPEAK')) {
			return message.channel.send({
				content:
					'I cannot speak in this voice channel, make sure I have the proper permissions!',
				reply: { messageReference: message.id },
			});
		}
		const searchString = args.join(' ');
		const videoPattern =
			/^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
		const regex = new RegExp(videoPattern);
		if (args[0].match(regex)) {
			var songInfo = await ytdl.getInfo(args[0].replace(/<(.+)>/g, '$1'));
			var song = {
				id: songInfo.videoDetails.video_id,
				title: Util.escapeMarkdown(songInfo.videoDetails.title),
				duration: songInfo.videoDetails.lengthSeconds,
				author: songInfo.videoDetails.ownerChannelName,
				url: songInfo.videoDetails.video_url,
			};
		}
		else {
			// message.reply('Please pass a valid youtube URL.');
			const searched = await yts.search(searchString);
			if (searched.videos.length === 0) {
				return message.channel.send({
					content: 'Looks like i was unable to find the song on YouTube',
					reply: { messageReference: message.id },
				});
			}

			songInfo = searched.videos[0];
			song = {
				id: songInfo.videoId,
				title: Util.escapeMarkdown(songInfo.title),
				author: songInfo.author.name,
				url: songInfo.url,
				duration: songInfo.duration.seconds,
			};
		}

		const serverQueue = message.client.queue.get(message.guild.id);

		if (serverQueue) {
			serverQueue.songs.push(song);
			console.log(serverQueue.songs);
			return message.channel.send({
				content: `<:check:807305471282249738> **${song.title}** has been added to the queue!`,
				reply: { messageReference: message.id },
			});
		}

		console.log(songInfo);

		const queueConstruct = {
			textChannel: message.channel,
			voiceChannel: channel,
			connection: null,
			songs: [],
			volume: 2.5,
			playing: true,
			loop: false,
		};
		message.client.queue.set(message.guild.id, queueConstruct);
		queueConstruct.songs.push(song);

		const play = async (song) => {
			const queue = message.client.queue.get(message.guild.id);
			if (!song) {
				queue.voiceChannel.leave();
				message.client.queue.delete(message.guild.id);
				return;
			}

			const dispatcher = queue.connection
				.play(ytdl(song.url, { quality: 'highestaudio', type: 'opus' }))
				.on('finish', () => {
					if (queue.loop == true) {
						queue.songs.push(queue.songs.shift());
					}
					else {
						queue.songs.shift();
					}
					play(queue.songs[0]);
				})
				.on('error', async (error) => {
					message.client.queue.delete(message.guild.id);
					await channel.leave();
					return sendError(
						`<:no:803069123918823454> I could not join the voice channel: ${error}`,
						message.channel,
					);
					console.error(error);
				});
			dispatcher.setVolumeLogarithmic(queue.volume / 5);
			if (queue.loop == true) return;
			queue.textChannel.send({
				content: `<:music:813204224456261632> Start playing: **${song.title}**`,
			});
		};

		// IF my dumbass code doesn't work run this and recomment after run.
		// if (!message.client.user.voice && serverQueue) return message.client.queue.delete(message.guild.id);

		try {
			const connection = await channel.join();
			queueConstruct.connection = connection;
			play(queueConstruct.songs[0]);
		}
		catch (error) {
			console.error(
				`<:no:803069123918823454> I could not join the voice channel: ${error}`,
			);
			message.client.queue.delete(message.guild.id);
			await channel.leave();
			return sendError(
				`<:no:803069123918823454> I could not join the voice channel: ${error}`,
				message.channel,
			);
		}
	},
};
