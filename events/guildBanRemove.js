const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const color = require('../color.json');
const { getLogChannel } = require('../utils.js');
const config = require('../config.json');
/** @type {(...args: import("discord.js").ClientEvents["guildBanRemove"]) => Promise<any>} */
module.exports = async (ban) => {
	const logChannel = getLogChannel(ban.guild, db);
	const { client } = ban;
	if (!logChannel) return;

	const embed = new MessageEmbed()
		.setTitle('🔓 Member Unban')
		.setColor(color.bot_theme)
		.setDescription(`Name: ${ban.user.username}\n \nID: ${ban.user.id}`)
		.setFooter({ text: `${client.user.username} MEMBER LOGGING` });
	// modLogChannel.send({ embeds: [embed] }).catch(console.error);
	const webhooks = await logChannel.fetchWebhooks();
	const webhook = webhooks.find(wh => wh.token);

	await webhook.send({
		username: `${client.user.username} Logging`,
		avatarURL: config.webhookAvatarURL,
		embeds: [embed],
	});
};