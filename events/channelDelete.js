module.exports = async (channel) => {
	const { getLogChannel } = require('../utils.js');
	const { MessageEmbed } = require('discord.js');
	const color = require('../color.json');
	const db = require('quick.db');
	if (channel.type == 'DM') return;

	if (getLogChannel(channel.guild, db)) {
		if (
			!getLogChannel(channel.guild, db)
				.permissionsFor(channel.guild.me)
				.has('VIEW_CHANNEL')
		) {return;}
		if (
			!getLogChannel(channel.guild, db)
				.permissionsFor(channel.guild.me)
				.has('SEND_MESSAGES')
		) {return;}
		const embed = new MessageEmbed()
			.setAuthor('⛔ Channel deleted')
			.setColor(color.fail)
			.setDescription(`Deleted channel #${channel.name}`)
			.setFooter('COOL BOI BOT SERVER LOGGING')
			.setTimestamp();

		const webhooks = await getLogChannel(channel.guild, db).fetchWebhooks();
		const webhook = webhooks.first();

		await webhook.send({
			username: 'COOL BOI BOT Logging',
			avatarURL:
				'https://cdn.discordapp.com/avatars/811024409863258172/f67bc2b8f122599864b02156cd67564b.png',
			embeds: [embed],
		});
	}
};
