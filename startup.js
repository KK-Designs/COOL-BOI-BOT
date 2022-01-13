module.exports = (client, Discord) => {
	const start_giveaway = require('./giveaway.js');
	const fs = require('fs');
	client.commands = new Discord.Collection();
	client.queue = new Discord.Collection();
	const commands = (client.commands = new Discord.Collection());

	const commandFolders = fs.readdirSync('./commands');

	for (const folder of commandFolders) {
		const commandFiles = fs
			.readdirSync(`./commands/${folder}`)
			.filter((file) => file.endsWith('.js'));

		for (const file of commandFiles) {
			const command = require(`./commands/${folder}/${file}`);
			client.commands.set(command.name, command);
		}
	}

	const { Collection } = require('discord.js');
	const categories = new Collection();

	commands.forEach((command) => {
		const category = categories.get(command.category);
		if (category) {
			category.set(command.name, command);
		}
		else {
			categories.set(
				command.category,
				new Collection().set(command.name, command),
			);
		}
	});

	start_giveaway(client);
};
