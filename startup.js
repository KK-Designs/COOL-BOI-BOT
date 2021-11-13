const fs = require('fs');
const { Collection } = require('discord.js');
const db = require('quick.db');
const chalk = require('chalk');
const start_giveaway = require('./giveaway.js');
module.exports = async (client) => {
	client.queue = new Collection();
	const commandFolders = fs.readdirSync('./commands');
	const events = fs.readdirSync('./events');
	const categories = new Collection();
	const startCommandsMS = new Date().getTime();
	let commandColor;
	let eventColor;
	let slashCommandsColor;
	let totalColor;
	for (const categoryName of commandFolders) {
		const categoryCmds = new Collection();
		const commandFiles = fs.readdirSync(`./commands/${categoryName}`).filter(file => file.endsWith('.js'));

		for (const file of commandFiles) {
			console.log('Loading command %s (%s)', file, categoryName);
			const command = require(`./commands/${categoryName}/${file}`);

			client.commands.set(command.name, command);
			categoryCmds.set(command.name, command);
		}
		categories.set(categoryName, categoryCmds);
	}
	const endCommandsMS = new Date().getTime();
	const timeCommandsMS = endCommandsMS - startCommandsMS;
	const startEventsMS = new Date().getTime();
	for (const eventName of events) {
		console.log('Loading event %s', eventName);
	}
	const endEventsMS = new Date().getTime();
	const timeEventsMS = endEventsMS - startEventsMS;
	const timeSlashCommandsMS = db.get('_slashCommandsMS');
	const totalBootTime = (timeSlashCommandsMS + timeCommandsMS + timeEventsMS);
	if (timeCommandsMS <= 2500) {
		commandColor = chalk.greenBright;
	} else if (timeCommandsMS <= 10000) {
		commandColor = chalk.yellowBright;
	} else {
		commandColor = chalk.redBright;
	}
	if (timeEventsMS <= 2500) {
		eventColor = chalk.greenBright;
	} else if (timeEventsMS <= 10000) {
		eventColor = chalk.yellowBright;
	} else {
		eventColor = chalk.redBright;
	}
	if (timeSlashCommandsMS <= 2500) {
		slashCommandsColor = chalk.greenBright;
	} else if (timeSlashCommandsMS <= 10000) {
		slashCommandsColor = chalk.yellowBright;
	} else {
		slashCommandsColor = chalk.redBright;
	}
	if (totalBootTime <= 2500) {
		totalColor = chalk.greenBright;
	} else if (totalBootTime <= 20000) {
		totalColor = chalk.yellowBright;
	} else {
		totalColor = chalk.redBright;
	}
	client.commands.forEach(command => {
		const category = categories.get(command.category) ?? new Collection();

		if (category) {
			category.set(command.name, command);
		}
		else {
			categories.set(command.category, new Collection().set(command.name, command));
		}
	});
	start_giveaway(client);
	console.log(chalk.blue('Startup Measurement Results\n-------------------------------'));
	console.log(timeSlashCommandsMS ? slashCommandsColor('(/) Command deploying time:', timeSlashCommandsMS + 'ms') : chalk.grey('Could not get (/) command loading time.'));
	console.log(commandColor('Command loading time:', timeCommandsMS + 'ms'));
	console.log(eventColor('Event loading time:', timeEventsMS + 'ms'));
	console.log(totalColor('Total boot time:', (timeCommandsMS + timeEventsMS + timeSlashCommandsMS) + 'ms'));
};