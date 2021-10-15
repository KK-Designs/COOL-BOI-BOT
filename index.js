require('dotenv').config();
const { Client, WebhookClient, MessageEmbed, Collection, Intents } = require('discord.js');
const db = require('quick.db');
const updateNotifier = require('update-notifier');
const { exec } = require('child_process');
const chalk = require('chalk');
const startup = require('./startup.js');
const color = require('./color.json');
const config = require('./config.json');
const pkg = require('./package.json');
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_PRESENCES,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_BANS,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.DIRECT_MESSAGES,
	],
	partials: [
		'MESSAGE',
		'CHANNEL',
		'REACTION',
		'GUILD_MEMBER',
		'USER',
	],
});

updateNotifier({ pkg }).notify();
client.commands = new Collection();
const reqEvent = (event) => {
	// eslint-disable-next-line global-require
	const run = require(`./events/${event}`);

	return async (...args) => {
		try {
			await run(...args);
		}
		catch (e) {
			console.error(e);
		}
	};
};
startup(client);
client.once('ready', reqEvent('ready').bind(null, client));
client.on('disconnect', (event) => {
	console.log('The WebSocket has closed and will no longer attempt to reconnect', event);
});
client.on('warn', (info) => {
	console.log(`Warn: ${info}`);
});
// Delete the value "_slashCommandsMS" incase the script wasn't ran
db.delete('_slashCommandsMS');
try {
	client.on('guildCreate', reqEvent('guildCreate'));
	client.on('guildDelete', reqEvent('guildDelete'));
	client.on('guildBanRemove', reqEvent('guildBanRemove'));
	client.on('guildBanAdd', reqEvent('guildBanAdd'));
	client.on('guildMemberUpdate', reqEvent('guildMemberUpdate'));
	client.on('emojiUpdate', reqEvent('emojiUpdate'));
	client.on('channelDelete', reqEvent('channelDelete'));
	client.on('channelCreate', reqEvent('channelCreate'));
	client.on('channelUpdate', reqEvent('channelUpdate'));
	client.on('emojiDelete', reqEvent('emojiDelete'));
	client.on('emojiCreate', reqEvent('emojiCreate'));
	client.on('messageCreate', reqEvent('messageCreate'));
	client.on('messageUpdate', reqEvent('messageUpdate'));
	client.on('messageDeleteBulk', reqEvent('messageDeleteBulk'));
	client.on('messageDelete', reqEvent('messageDelete'));
	client.on('guildMemberAdd', reqEvent('guildMemberAdd'));
	client.on('guildMemberRemove', reqEvent('guildMemberRemove'));
	client.on('interactionCreate', reqEvent('interactionCreate'));
}
catch (err) {
	console.error(err);
}
client.login(process.env.BOT_TOKEN);
const processing = false;
process.on('SIGINT', async () => {
	if (processing) {return console.log('Already shutting down');}
	const readline = require('readline').createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	readline.question('Are you sure you want to shut down? (y/n)', res => {
		if (res === 'y') {
			console.log('Shutting down...');
			const timer = setTimeout(() => {
				console.log('Took too long. Forcing a shutdown');
				process.exit(1);
			});

			console.log('Destroying queues');
			for (const queue of client.queue.values()) {queue.destroy();}

			console.log('Destroying client');
			client.destroy();
			clearTimeout(timer);
			console.log('Success. Closing process');
			process.exit();
		} else if (res === 'n') {
			console.log('Rebooting bot...');
			exec('node .');
		} else {
			console.error(`${chalk.red(`Error: Expected "y" or "n" but got "${res}"`)}`);
			process.exit(1);
		}
		readline.close();
	});
});
const webhook = new WebhookClient({ url: config.webhookURL });
process.on('unhandledRejection', async error => {
	console.error('Unhandled Rejection: ', error);
	const embed = new MessageEmbed()
		.setTitle('Unhandled Rejection')
		.setColor(color.fail)
		.setDescription(
			`<:X_:807305490160943104> Your bad at coding and messed something up here\n\n\`${error}\``,
		);

	await webhook.send({ embeds: [embed] }).catch(console.error);
});
process.on('uncaughtException', async error => {
	console.error('Unhandled Exception: ', error);
	try {
		const embed = new MessageEmbed()
			.setColor(color.fail)
			.setTitle('Uncaught Exception')
			.setDescription(
				`<:X_:807305490160943104> Your bad at coding and messed something up here\n\n\`${error}\``,
			);

		await webhook.send({ embeds: [embed] });
	} catch (e) {
		console.error(e);
	} finally {
		process.exit();
	}
});
