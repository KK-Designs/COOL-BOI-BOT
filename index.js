require('dotenv').config();
const { Client, WebhookClient, MessageEmbed, Collection, Intents } = require('discord.js');
const db = require('quick.db');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const startup = require('./startup.js');
const color = require('./color.json');
const config = require('./config.json');
require('pretty-error').start();
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_BANS,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Intents.FLAGS.GUILD_PRESENCES,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.GUILD_VOICE_STATES,
	],
	partials: [
		'MESSAGE',
		'CHANNEL',
		'REACTION',
		'GUILD_MEMBER',
		'USER',
	],
	ws: { properties: { $browser: 'Discord iOS' } },
});

client.commands = new Collection();
const reqEvent = (event) => {
	// eslint-disable-next-line global-require
	const run = require(`./events/${event}`);

	return async (...args) => {
		try {
			await run(...args);
		} catch (e) {
			console.error(e);
		}
	};
};
startup(client);

// client.once('ready', reqEvent('ready').bind(null, client));

client.on('disconnect', (event) => {
	console.log('The WebSocket has closed and will no longer attempt to reconnect', event);
});

client.on('warn', (info) => {
	console.log(`Warn: ${info}`);
});

// Delete the value "_slashCommandsMS" incase the script wasn't ran
db.delete('_slashCommandsMS');

try {
	const files = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
	for (const events of files) {
		if (path.parse(events).name !== 'ready') {
			client.on(path.parse(events).name, reqEvent(path.parse(events).name));
		} else {
			client.once(path.parse(events).name, reqEvent(path.parse(events).name));
		}
	}
} catch (err) {
	console.error(err);
}
console.log(process.env.BOT_TOKEN);
client.login(process.env.BOT_TOKEN);
const processing = false;
process.on('SIGINT', async () => {
	if (processing) {return console.log('Already shutting down');}
	const readline = require('readline').createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	const spawn = require('child_process').spawn;

	readline.question(`Are you sure you want to shut down? (${chalk.greenBright('y')}/${chalk.redBright('n')})`, res => {
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
			(function main() {

				if (process.env.process_restarting) {
					delete process.env.process_restarting;
					// Give old process one second to shut down before continuing ...
					setTimeout(main, 1000);
					return;
				}

				// ...

				// Restart process ...
				spawn(process.argv[0], process.argv.slice(1), {
					env: { process_restarting: 1 },
					stdio: 'ignore',
					detached: true,
				}).unref();
			})();
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
