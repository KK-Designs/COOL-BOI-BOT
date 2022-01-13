module.exports = async (guild) => {
	console.log('Server removal process started');
	const db = require('quick.db');
	const { getLogChannel } = require('../utils.js');
	const prefix = require('discord-prefix');
	const webhooks = await getLogChannel(guild, db)?.fetchWebhooks() ?? 0;
	if (webhooks == 0) return;
	const webhook = webhooks.first();
	db.delete('blockcmds_' + guild.id);
	console.log('Deleted blocked commands');
	db.delete(`loggingchannel_${guild.id}`);
	console.log('Deleted logging sytem (partial)');
	webhook.delete('COOL BOI BOT got kicked from the server :( Mind reinviting us back?');
	console.log('Deleted logging webhook (full)');
	db.delete(`welcomechannel_${guild.id}`);
	console.log('Deleted welcome channel');
	prefix.removePrefix(guild.id);
	console.log('Deleted prefix');
};
