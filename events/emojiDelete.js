module.exports = async (emoji) => {
	const { getLogChannel } = require('../utils.js');
	const { MessageEmbed } = require('discord.js');
	const color = require('../color.json');
	const db = require('quick.db');

	if (!getLogChannel(emoji.guild, db)) return;

	const embed = new MessageEmbed()
		.setTitle('⛔ Emoji Delete')
		.setColor(color.bot_theme)
		.setDescription(`Name: ${emoji.name}\nID: ${emoji.id}`)
		.addField('Emoji URL', emoji.url)
		.setFooter('COOL BOI BOT SERVER LOGGING')
		.setTimestamp();

	const webhooks = await getLogChannel(emoji.guild, db).fetchWebhooks();
	const webhook = webhooks.first();

	await webhook.send({
		username: 'COOL BOI BOT Logging',
		avatarURL:
			'https://cdn.discordapp.com/avatars/811024409863258172/f67bc2b8f122599864b02156cd67564b.png',
		embeds: [embed],
	});
};
