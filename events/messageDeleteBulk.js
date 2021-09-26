const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const color = require('../color.json');
const { getLogChannel } = require('../utils.js');
const config = require('../config.json');
module.exports = async messages => {
	if (messages.partial) {return;}

	if (messages.first().channel.name === 'server-logs') {return;}

	const messageChannel = messages.first().channel.name;
	const logChannel = getLogChannel(messages.first().guild, db);

	if (!logChannel) {return;}

	const messageArray = [...messages.values()];
	// messageArray.slice(10, messageArray.length); // Slice removes all ements from the first number to the second number in an array. We use this to cut off the length of the array
	let stringedArray = messageArray.join('\n'); // We join the array using \n to separate the lines
	if (stringedArray.length > 2048) {stringedArray = stringedArray.slice(0, 2045) + '...';}

	const embed = new MessageEmbed()
		.setColor(color.bot_theme)
		.setAuthor(`Messages Purged in #${messageChannel}`)
		.setTitle(`Message Bulk delete by ${messages.first().author.tag} deleted ${messages.size - 1} messages`)
		.setDescription(`${stringedArray}`)
		.setFooter('COOL BOI BOT MESSAGE LOGGING')
		.setTimestamp();
	// modLogChannel.send({ embeds: [embed] }).catch(console.error);
	const webhooks = await logChannel.fetchWebhooks();
	const webhook = webhooks.first();

	await webhook.send({
		username: 'COOL BOI BOT Logging',
		avatarURL: config.webhookAvatarURL,
		embeds: [embed],
	});
};