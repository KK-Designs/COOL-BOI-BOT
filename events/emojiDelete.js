module.exports = async emoji => {
	const { MessageEmbed } = require('discord.js');
	const color = require('../color.json');
	const db = require('quick.db');
	var modLogChannel = db.get('loggingchannel_' + emoji.guild.id);
	var modLogChannel = emoji.guild.channels.cache.get(modLogChannel);

	if (!modLogChannel) return;

	const embed = new MessageEmbed()
		.setTitle('⛔ Emoji Delete')
		.setColor(color.bot_theme)
		.setDescription(`Name: ${emoji.name}\nID: ${emoji.id}`)
		.addField('Emoji URL', emoji.url)
		.setFooter('COOL BOI BOT SERVER LOGGING')
		.setTimestamp();
	modLogChannel.send({ embeds: [embed] });

};