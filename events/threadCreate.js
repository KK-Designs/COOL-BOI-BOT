const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { getLogChannel } = require('../utils.js');
const color = require('../color.json');
const db = require('quick.db');
const config = require('../config.json');
const humanizeDuration = require('humanize-duration');
/** @type {(...args: import("discord.js").ClientEvents["threadCreate"]) => Promise<any>} */
module.exports = async (channel) => {
	if (channel.partial) channel = await channel.fetch();
	await channel.join();
	const { client } = channel.guild;
	const owner = await channel.fetchOwner();
	const jumpToChannel = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setURL(`https://discord.com/channels/${channel.guild.id}/${channel.id}`)
				.setLabel('Go to channel')
				.setEmoji('⬆️')
				.setStyle('LINK'),
		);
	const embed = new MessageEmbed()
		.setAuthor('🧵 Thread created')
		.setColor(color.bot_theme)
		.setDescription(`${owner.user.tag} created thread at ${channel}`)
		.addField('Thread Created:', `<t:${Math.floor(channel.createdTimestamp / 1000)}:f>`, true)
		.addField('Archive time:', humanizeDuration(channel.autoArchiveDuration * 60000, { delimiter: ' and ' }), true)
		.setFooter(`${client.user.username} SERVER LOGGING`)
		.setTimestamp();
	const logChannel = getLogChannel(channel.guild, db);
	const webhooks = await logChannel.fetchWebhooks();
	const webhook = webhooks.find(wh => wh.owner.id === client.user.id);

	await webhook.send({
		username: `${client.user.username} Logging`,
		avatarURL: config.webhookAvatarURL,
		embeds: [embed],
		components: [jumpToChannel],
	});
};