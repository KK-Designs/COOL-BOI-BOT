module.exports = async (message, messageNew) => {
	const { MessageEmbed } = require('discord.js');
	const color = require('../color.json');
	const db = require('quick.db');
	if (message.partial) return;
	if (message.content === messageNew.content) return;
	if (message.author.bot) return;
	var modLogChannel = db.get('loggingchannel_' + message.guild.id);
	var modLogChannel = message.guild.channels.cache.get(modLogChannel);

	if (!modLogChannel) return;
	const embed = new MessageEmbed()
		.setAuthor('📝 Message updated')
		.setColor(color.bot_theme)
		.setDescription(`${message.author} edited a message in ${message.channel}`)
		.addField('Old message:', `${message}`, true)
		.addField('New message:', `${messageNew}`, true)
		.setFooter('COOL BOI BOT MESSAGE LOGGING')
		.setTimestamp();

	modLogChannel.send({ embeds: [embed] }).catch();

};