module.exports = async channel => {
	const { MessageEmbed } = require('discord.js');
	const color = require('../color.json');
	const db = require('quick.db');
	if (channel.type == 'DM') return;

	var modLogChannel = db.get('loggingchannel_' + channel.guild.id);
	var modLogChannel = channel.guild.channels.cache.get(modLogChannel);

	if (modLogChannel) {

		if (!modLogChannel.permissionsFor(channel.guild.me).has('VIEW_CHANNEL')) return;
		if (!modLogChannel.permissionsFor(channel.guild.me).has('SEND_MESSAGES')) return;
		const embed = new MessageEmbed()
			.setAuthor('⛔ Channel deleted')
			.setColor(color.fail)
			.setDescription(`Deleted channel #${channel.name}`)
			.setFooter('COOL BOI BOT SERVER LOGGING')
			.setTimestamp();

		modLogChannel.send({ embeds: [embed] });

	}

};