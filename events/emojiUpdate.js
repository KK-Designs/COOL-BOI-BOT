const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const color = require('../color.json');
const { getLogChannel } = require('../utils.js');
const config = require('../config.json');
/** @type {(...args: import("discord.js").ClientEvents["emojiUpdate"]) => Promise<any>} */
module.exports = async (oldemoji, newemoji) => {
	const logChannel = getLogChannel(newemoji.guild, db);
	const { client } = newemoji;
	if (!logChannel) return;

	const embed = new MessageEmbed()
		.setTitle('📝 Emoji Update')
		.setColor(color.bot_theme)
		.setDescription(`New Name: ${newemoji} ${newemoji.name}\n \nOld Name: ${oldemoji.name}\n \nID: ${newemoji.id}`)
		.addField('New Emoji URL', newemoji.url)
		.addField('Old Emoji URL', oldemoji.url)
		.setFooter(`${client.user.username} SERVER LOGGING`)
		.setTimestamp();
	// modLogChannel.send({ embeds: [embed] }).catch(console.error);
	const webhooks = await logChannel.fetchWebhooks();
	const webhook = webhooks.find(wh => wh.owner.id === client.user.id);

	await webhook.send({
		username: `${client.user.username} Logging`,
		avatarURL: config.webhookAvatarURL,
		embeds: [embed],
	});
};