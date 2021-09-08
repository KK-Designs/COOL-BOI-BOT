module.exports = async (oldchannel, newchannel) => {
	const { MessageEmbed } = require('discord.js');
	const color = require('../color.json');
	const db = require('quick.db');
	if (oldchannel.type == 'DM' || oldchannel.name === newchannel.name) return;
	var modLogChannel = db.get('loggingchannel_' + oldchannel.guild.id);
	var modLogChannel = oldchannel.guild.channels.cache.get(modLogChannel);

	if (modLogChannel) {

		if (!modLogChannel.permissionsFor(newchannel.guild.me).has('VIEW_CHANNEL')) return;
		if (!modLogChannel.permissionsFor(newchannel.guild.me).has('SEND_MESSAGES')) return;
		const embed = new MessageEmbed()
			.setAuthor('📝 Channel updated')
			.setColor(color.bot_theme)
			.setDescription(`Channel Updated ${oldchannel}`)
			.addField('Old channel:', `${oldchannel.name}`, true)
			.addField('New channel:', `${newchannel.name}`, true)
			.setFooter('COOL BOI BOT SERVER LOGGING')
			.setTimestamp();

		modLogChannel.send({ embeds: [embed] });

	}

};