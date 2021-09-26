/** @type {(...args: import("discord.js").ClientEvents["interactionCreate"]) => Promise<any>} */
module.exports = async (interaction) => {
	console.log('Interaction', Date.now() - interaction.createdTimestamp);
	if (!interaction.isCommand()) {return;}

	const { client } = interaction;
	const command = client.commands.get(interaction.commandName);

	if (!command?.executeSlash) {return;}

	try {
		await command.executeSlash(interaction, client);
	}
	catch (e) {
		console.error(e);
		const method = command.replied || command.deferred ? 'followUp' : 'reply';

		await interaction[method](`An error has occurred: ${e.message}`);
	}
};