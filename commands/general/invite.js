module.exports = {
	name: 'invite',
	description: 'Gets the bot invite link!',
	cooldown: 3,
	category: 'general',
	options: {},
	async execute(message, args) {
		message.reply({ content: `My invte link is: \nhttps://discord.com/api/oauth2/authorize?client_id=${message.client.user.id}&permissions=2453142983&scope=bot%20applications.commands` });
	},
	async executeSlash(interaction, client) {
		await interaction.reply({
			content: `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=3728080855&scope=bot%20applications.commands`,
			ephemeral: true,
		});
	},
};