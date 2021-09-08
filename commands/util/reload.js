module.exports = {
	name: 'reload',
	description: 'Reloads a command',
	cooldown: 5,
	usage: '[command]',
	category: 'util',
	execute(message, args) {
		const fs = require('fs');
		const { suggest } = require('@laboralphy/did-you-mean');
		const { commands } = message.client;
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName)
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));


		if (!command) {
			const thing = commands.map(command => command.name);

			const result = suggest(commandName, thing);
			let error = `There is no command with name or alias with \`${commandName}\`, did you mean \`${result.join(' or ')}\`?`;
			if (!result.length) {
				error = `There is no command with name or alias \`${commandName}\`, ${message.author}!`;
			}
			return message.channel.send({ content: error, reply: { messageReference: message.id } });
		}

		const commandFolders = fs.readdirSync('./commands');
		const folderName = commandFolders.find(folder => fs.readdirSync(`./commands/${folder}`).includes(`${commandName}.js`));

		delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];

		try {
			const newCommand = require(`../${folderName}/${command.name}.js`);
			message.client.commands.set(newCommand.name, newCommand);
			message.channel.send({ content: `Command \`${command.name}\` was reloaded!`, reply: { messageReference: message.id } });
		}
		catch (error) {
			console.error(error);
			message.channel.send({ content: `There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``, reply: { messageReference: message.id } });
		}
	},
};