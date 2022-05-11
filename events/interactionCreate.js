const db = require('quick.db');
/** @type {(...args: import("discord.js").ClientEvents["interactionCreate"]) => Promise<any>} */
module.exports = async (interaction) => {
	if (!interaction.isCommand()) return;

	const { client } = interaction;
	const { commands } = client;
	const command = commands.get(interaction.commandName);

	if (!command?.executeSlash) return await interaction.reply('Unknown command');
	if (command?.guildOnly) return await interaction.reply('That is a server only command. I can\'t execute those inside DMs. Use `/help [command name]` to if it is server only command.');

	try {
		await command.executeSlash(interaction, client);
		if (interaction.guild) {
			db.add(`commands_${interaction.guild.id}_${interaction.user.id}`, 1);
		}
	} catch (e) {
		console.error(e);
		const method = interaction.replied || interaction.deferred ? 'followUp' : 'reply';

		await interaction[method](`An error has occurred: ${e.message ?? e}`);
	}
};