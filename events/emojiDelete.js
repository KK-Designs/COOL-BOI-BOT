const { MessageEmbed } = require('discord.js');
const color = require('../color.json');
const { getLogChannel } = require('../utils.js');
const config = require('../config.json');
/** @type {(...args: import("discord.js").ClientEvents["emojiDelete"]) => Promise<any>} */
module.exports = async emoji => {
	const logChannel = getLogChannel(emoji.guild, db);

	if (!logChannel) {return;}

	const webhooks = await logChannel.fetchWebhooks();
	const webhook = webhooks.first();
	const embed = new MessageEmbed()
		.setTitle('⛔ Emoji Delete')
		.setColor(color.bot_theme)
		.setDescription(`Name: ${emoji.name}\nID: ${emoji.id}`)
		.addField('Emoji URL', emoji.url)
		.setFooter('COOL BOI BOT SERVER LOGGING')
		.setTimestamp();

	await webhook.send({
		username: 'COOL BOI BOT Logging',
		avatarURL: config.webhookAvatarURL,
		embeds: [embed],
	});
};