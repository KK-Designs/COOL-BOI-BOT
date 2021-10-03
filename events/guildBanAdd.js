const { MessageEmbed } = require('discord.js');
const color = require('../color.json');
const db = require('quick.db');
const { getLogChannel } = require('../utils.js');
const config = require('../config.json');
/** @type {(...args: import("discord.js").ClientEvents["guildBanAdd"]) => Promise<any>} */
module.exports = async (ban) => {
	const { client } = ban;
	const modLogChannelID = db.get('loggingchannel_' + ban.guild.id);
	const modLogChannel = ban.guild.channels.cache.get(modLogChannelID);

	if (!modLogChannel) {return;}

	const webhooks = await getLogChannel(ban.guild, db).fetchWebhooks();
	const webhook = webhooks.first();
	const embed = new MessageEmbed()
		.setTitle('🔒 Member ban')
		.setColor(color.bot_theme)
		.setDescription(`Name: ${ban.user.username}\n \nID: ${ban.user.id}`)
		.setFooter(`${client.user.username} MEMBER LOGGING`);

	await webhook.send({
		username: `${client.user.username} Logging`,
		avatarURL: config.webhookAvatarURL,
		embeds: [embed],
	});
};