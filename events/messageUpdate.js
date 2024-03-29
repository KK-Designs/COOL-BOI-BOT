const { getLogChannel } = require('../utils.js');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const db = require('quick.db');
const color = require('../color.json');
const config = require('../config.json');
/** @type {(...args: import("discord.js").ClientEvents["messageUpdate"]) => Promise<any>} */
module.exports = async (message, messageNew) => {
	if (!message.partial && message.content === messageNew.content) return;

	if (messageNew.partial) messageNew = await messageNew.fetch();

	if (messageNew.author.bot) return;

	const { client } = messageNew;
	const logChannel = getLogChannel(message.guild, db);

	if (!logChannel) return;

	const jumpToMsg = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setURL(`https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`)
				.setLabel('Jump to message')
				.setEmoji('⬆️')
				.setStyle('LINK'),
		);
	const embed = new MessageEmbed()
		.setAuthor({ name: '📝 Message updated' })
		.setColor(color.bot_theme)
		.setDescription(`${messageNew.author} edited a message in ${message.channel}`)
		.setFooter({ text: `${client.user.username} MESSAGE LOGGING` })
		.setTimestamp();

	if (!message.partial && message.content) {embed.addField('Old message:', `${message}`, true);}

	if (messageNew.content) {embed.addField('New message:', `${messageNew}`, true);}

	const webhooks = await logChannel.fetchWebhooks();
	const webhook = webhooks.find(wh => wh.token);

	await webhook.send({
		username: `${client.user.username} Logging`,
		avatarURL: config.webhookAvatarURL,
		embeds: [embed],
		components: [jumpToMsg],
	});
};
