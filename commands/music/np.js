const { MessageEmbed } = require('discord.js');
const humanizeDuration = require('humanize-duration');
const Bar = require('string-progressbar');
module.exports = {
	name: 'np',
	description: 'See the surrent dong playing.',
	cooldown: 5,
	guildOnly: true,
	category: 'music',
	aliases: ['nowplaying'],
	options: {},
	async execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);

		if (!serverQueue) {return await message.channel.send('There is nothing playing.');}

		const currentSong = serverQueue.songs[0];
		const currentDuration = Math.round(serverQueue.player.state.resource.playbackDuration / 1000);
		const totalDuration = currentSong.duration;
		const [bar] = Bar.splitBar(totalDuration, currentDuration, 25);
		const embed = new MessageEmbed()
			.setColor(message.guild.me.displayHexColor)
			.setTitle('Current Song playing')
			.addField(
				'<:playing:813209288100151366> Now playing:',
				`${currentSong.title} • ${currentSong.author}`,
				true,
			)
			.addField('Duration:', `${humanizeDuration(totalDuration * 1000)}`, true)
			.addField('\u200b', bar)
			.setTimestamp()
			.setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true }));

		return await message.reply({ embeds: [embed] });
	},
	async executeSlash(interaction) {
		const serverQueue = interaction.client.queue.get(interaction.guild.id);

		if (!serverQueue) {return await interaction.channel.send('There is nothing playing.');}

		const currentSong = serverQueue.songs[0];
		const currentDuration = Math.round(serverQueue.player.state.resource.playbackDuration / 1000);
		const totalDuration = currentSong.duration;
		const [bar] = Bar.splitBar(totalDuration, currentDuration, 25);
		const embed = new MessageEmbed()
			.setColor(interaction.guild.me.displayHexColor)
			.setTitle('Current Song playing')
			.addField(
				'<:playing:813209288100151366> Now playing:',
				`${currentSong.title} • ${currentSong.author}`,
				true,
			)
			.addField('Duration:', `${humanizeDuration(totalDuration * 1000)}`, true)
			.addField('\u200b', bar)
			.setTimestamp()
			.setFooter(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }));

		return await interaction.reply({ embeds: [embed] });
	},
};