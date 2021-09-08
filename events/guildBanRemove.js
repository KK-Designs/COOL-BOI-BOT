module.exports = async (ban) => {
	const { MessageEmbed } = require('discord.js');
	const color = require('../color.json');
	const db = require('quick.db');
	var modLogChannel = db.get('loggingchannel_' + ban.guild.id);
	var modLogChannel = ban.guild.channels.cache.get(modLogChannel);

	if (!modLogChannel) return;

	const embed = new MessageEmbed()
		.setTitle('🔓 Member Unban')
		.setColor(color.bot_theme)
		.setDescription(`Name: ${ban.user.username}\n \nID: ${ban.user.id}`)
		.setFooter('COOL BOI BOT MEMBER LOGGING');
	modLogChannel.send({ embeds: [embed] });

};