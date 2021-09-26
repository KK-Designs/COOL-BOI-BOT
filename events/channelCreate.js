const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const color = require('../color.json');
const db = require('quick.db');
const { getLogChannel } = require('../utils.js');
const config = require('../config.json');
/** @type {(...args: import("discord.js").ClientEvents["channelCreate"]) => Promise<any>} */
module.exports = async channel => {
	if (channel.type === 'DM') {return;}

	const logChannel = getLogChannel(channel.guild, db);

	if (!logChannel) {return;}

	const botPerms = logChannel.permissionsFor(channel.guild.me);

	if (!botPerms.has('VIEW_CHANNEL')) {return;}

	if (!botPerms.has('MANAGE_WEBHOOKS')) {return;}

	if (!botPerms.has('SEND_MESSAGES')) {return;}

	const jumpToChannel = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setURL(`https://discord.com/channels/${channel.guild.id}/${channel.id}`)
				.setLabel('Go to channel')
				.setEmoji('⬆️')
				.setStyle('LINK'),
		);
	const embed = new MessageEmbed()
		.setAuthor('🔨 Channel created')
		.setColor(color.success)
		.setDescription(`Created channel ${channel}`)
		.setFooter('COOL BOI BOT SERVER LOGGING')
		.setTimestamp();
	const webhooks = await logChannel.fetchWebhooks();
	const webhook = webhooks.first();

	await webhook.send({
		username: 'COOL BOI BOT Logging',
		avatarURL: config.webhookAvatarURL,
		embeds: [embed],
		components: [jumpToChannel],
	});
};