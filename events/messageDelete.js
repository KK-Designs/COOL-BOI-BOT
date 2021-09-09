module.exports = async message => {
	const { MessageEmbed } = require('discord.js');
	const color = require('../color.json');
	if (message.partial) return;
	if (message.channel.type === 'DM') return;
	if (message.author.bot) return;
	if (message.content === '') return;
	const messageChannel = message.channel.name;
	const db = require('quick.db');
	const simplydjs = require('simply-djs');
	var logchannel = db.get('loggingchannel_' + message.guild.id);
	var logchannel = message.guild.channels.cache.get(logchannel);
	if (!logchannel) return;
	// ignore direct messages
	if (!message.guild) return;
	const fetchedLogs = await message.guild.fetchAuditLogs({
		limit: 1,
		type: 'MESSAGE_DELETE',
	});
	// Since we only have 1 audit log entry in this collection, we can simply grab the first one
	const deletionLog = fetchedLogs.entries.first();

	// Let's perform a coherence check here and make sure we got *something*
	if (!deletionLog) return console.log(`A message by ${message.author.tag} was deleted, but no relevant audit logs were found.`);

	// We now grab the user object of the person who deleted the message
	// Let us also grab the target of this action to double check things
	const { executor, target } = deletionLog;
	const user = executor.tag;
	const delembed = new MessageEmbed()
		.setColor(color.bot_theme)
		.setAuthor(executor.tag, executor.displayAvatarURL({ dynamic: true }))
		.setTitle(`Message by ${message.author.tag} was deleted in #${messageChannel}, by ${executor.tag}`)
		.setDescription(message.content)
		.setFooter('COOL BOI BOT MESSAGE LOGGING')
		.setTimestamp();

	const delembed1 = new MessageEmbed()
		.setColor(color.bot_theme)
	// .setAuthor(executor.tag,  executor.displayAvatarURL({ dynamic: true }))
		.setTitle(`Message by ${message.author.tag} was deleted in #${messageChannel}`)
		.setDescription(message.content)
		.setFooter('COOL BOI BOT MESSAGE LOGGING')
		.setTimestamp();

	if (message.author.bot) return;
	// And now we can update our output with a bit more information
	// We will also run a check to make sure the log we got was for the same author's message
	if (target.id === message.author.id) {
		logchannel.send({ embeds: [ delembed ] });
	}
	else {
		logchannel.send({ embeds: [ delembed1 ] });
	}

};