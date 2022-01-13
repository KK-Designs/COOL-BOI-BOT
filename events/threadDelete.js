const { MessageEmbed } = require('discord.js');
const { bold } = require('@discordjs/builders');
const { getLogChannel } = require('../utils.js');
const color = require('../color.json');
const db = require('quick.db');
const config = require('../config.json');
/** @type {(...args: import("discord.js").ClientEvents["threadDelete"]) => Promise<any>} */
module.exports = async (channel) => {
	const { client } = channel.guild;
	const owner = await client.users.fetch(channel.ownerId);
	let members = await channel.guildMembers.array().join(` ${bold('|')} `);
	if (members.length >= 1024) members = members.slice(0, 2045) + '...';
	const embed = new MessageEmbed()
		.setAuthor({ name: '⛔ Thread Deleted' })
		.setColor(color.bot_theme)
		.setDescription(`${owner.tag} deleted thread ${channel.name}`)
		.addField('Thread Created:', `<t:${Math.floor(channel.createdTimestamp / 1000)}:f>`, true)
		.addField('Members:', `${members}`, true)
		.addField('Total Messages:', `${channel.messages.cache.size}`, true)
		.setFooter({ text: `${client.user.username} SERVER LOGGING` })
		.setTimestamp();
	const logChannel = getLogChannel(channel.guild, db);
	const webhooks = await logChannel.fetchWebhooks();
	const webhook = webhooks.find(wh => wh.token);

	await webhook.send({
		username: `${client.user.username} Logging`,
		avatarURL: config.webhookAvatarURL,
		embeds: [embed],
	});
};