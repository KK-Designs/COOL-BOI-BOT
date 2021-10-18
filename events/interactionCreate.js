const db = require('quick.db');
/** @type {(...args: import("discord.js").ClientEvents["interactionCreate"]) => Promise<any>} */
module.exports = async (interaction) => {
	if (!interaction.isCommand()) return;

	const { client } = interaction;
	const command = client.commands.get(interaction.commandName);

	if (!command?.executeSlash) return await interaction.reply('Unknown command');

	try {
		await command.executeSlash(interaction, client);
		db.add(`commands_${interaction.guild.id}_${interaction.user.id}`, 1);
	}
	catch (e) {
		console.error(e);
		const method = interaction.replied || interaction.deferred ? 'followUp' : 'reply';

		await interaction[method](`An error has occurred: ${e.message ?? e}`);
	}
};