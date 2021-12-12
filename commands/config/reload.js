const meant = require('meant');
module.exports = {
	name: 'reload',
	description: 'Reloads a command',
	cooldown: 5,
	usage: '[command]',
	category: 'config',
	options: {
		command: {
			type: 'String',
			description: 'The command to reload',
		},
	},
	async execute(message, args) {

		const { commands } = message.client;
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName)
   || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));


		if (!command) {
			const thing = commands.map(c => c.name);
			const result = meant(commandName, thing);
			let error = `There is no command with name or alias with \`${commandName}\`, did you mean \`${result.join(' or ')}\`?`;
			if (!result.length) {
				error = `There is no command with name or alias \`${commandName}\`, ${message.author}!`;
			}

			return await message.reply({ content: error });
		}
		const folderName = command.category;

		delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];
		try {
			const newCommand = require(`../${folderName}/${command.name}.js`);

			message.client.commands.set(newCommand.name, newCommand);
			message.reply({ content: `Command \`${command.name}\` was reloaded!` });
		} catch (error) {
			console.error(error);
			await message.reply({ content: `There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\`` });
		}
	},
	async executeSlash(interaction) {
		const { client } = interaction;
		const { commands } = interaction.client;
		const commandName = interaction.options.getString('command', true);
		const command = client.commands.get(commandName)
   || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));


		if (!command) {
			const thing = commands.map(c => c.name);
			const result = meant(commandName, thing);
			let error = `There is no command with name or alias with \`${commandName}\`, did you mean \`${result.join(' or ')}\`?`;
			if (!result.length) {
				error = `There is no command with name or alias \`${commandName}\`, ${interaction.user}!`;
			}

			return await interaction.reply({ content: error });
		}
		const folderName = command.category;

		delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];
		try {
			const newCommand = require(`../${folderName}/${command.name}.js`);

			client.commands.set(newCommand.name, newCommand);
			interaction.reply({ content: `Command \`${command.name}\` was reloaded!` });
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: `There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\`` });
		}
	},
};