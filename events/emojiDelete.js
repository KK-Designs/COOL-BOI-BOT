const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const color = require('../color.json');
const { getLogChannel } = require('../utils.js');
const config = require('../config.json');
/** @type {(...args: import("discord.js").ClientEvents["emojiDelete"]) => Promise<any>} */
module.exports = async emoji => {
	const logChannel = getLogChannel(emoji.guild, db);
	const { client } = emoji;
	if (!logChannel) return;

	const webhooks = await logChannel.fetchWebhooks();
	const webhook = webhooks.find(wh => wh.token);
	const embed = new MessageEmbed()
		.setTitle('⛔ Emoji Delete')
		.setColor(color.bot_theme)
		.setDescription(`Name: ${emoji.name}\nID: ${emoji.id}`)
		.addField('Emoji URL', emoji.url)
		.setFooter({ text: `${client.user.username} SERVER LOGGING` })
		.setTimestamp();

	await webhook.send({
		username: `${client.user.username} Logging`,
		avatarURL: config.webhookAvatarURL,
		embeds: [embed],
	});
};
