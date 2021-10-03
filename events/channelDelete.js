const { MessageEmbed } = require('discord.js');
const color = require('../color.json');
const db = require('quick.db');
const { getLogChannel } = require('../utils.js');
const config = require('../config.json');
/** @type {(...args: import("discord.js").ClientEvents["channelDelete"]) => Promise<any>} */
module.exports = async channel => {
	if (channel.type === 'DM') {return;}

	const logChannel = getLogChannel(channel.guild, db);

	const { client } = channel;

	if (!logChannel) {return;}

	const botPerms = logChannel.permissionsFor(channel.guild.me);

	if (!botPerms.has('VIEW_CHANNEL')) {return;}

	if (!botPerms.has('MANAGE_WEBHOOKS')) {return;}

	if (!botPerms.has('SEND_MESSAGES')) {return;}

	const webhooks = await getLogChannel(channel.guild, db).fetchWebhooks();
	const webhook = webhooks.first();
	const embed = new MessageEmbed()
		.setAuthor('⛔ Channel deleted')
		.setColor(color.fail)
		.setDescription(`Deleted channel #${channel.name}`)
		.setFooter(`${client.user.username} SERVER LOGGING`)
		.setTimestamp();

	await webhook.send({
		username: `${client.user.username} Logging`,
		avatarURL: config.webhookAvatarURL,
		embeds: [embed],
	});

};