const simplydjs = require('simply-djs');
const color = require('../../color.json');
module.exports = {
	name: 'tictactoe',
	description: 'Play a fun game of tictactoe with your friends!',
	aliases: ['ttt'],
	cooldown: 15,
	category: 'games',
	options: {
		user: {
			type: 'User',
			description: 'The user to compete with in tic-tac-toe',
		},
	},
	async execute(message) {
		await simplydjs.tictactoe(message, {
			embedColor: color.bot_theme,
			embedFooter: `Powered by ${message.client.user.username} Games`,
			credit: false,
		});
	},
	async executeSlash(interaction) {
		await interaction.deferReply();
		await simplydjs.tictactoe(interaction, {
			slash: true,
			embedColor: color.bot_theme,
			embedFooter: `Powered by ${interaction.client.user.username} Games`,
			credit: false,
		});
	},
};