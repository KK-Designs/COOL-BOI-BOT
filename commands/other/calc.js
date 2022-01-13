const simplydjs = require('simply-djs');
const color = require('../../color.json');
module.exports = {
	name: 'calc',
	description: 'Calculate the provided expression ➕',
	usage: '[expression]',
	cooldown: 3,
	category: 'other',
	options: {},
	async execute(message) {
		await simplydjs.calculator(message, {
			embedColor: color.bot_theme,
			credit: false,
		});
	},
	async executeSlash(interaction) {
		await interaction.deferReply();
		await simplydjs.calculator(interaction, {
			slash: true,
			embedColor: color.bot_theme,
			credit: false,
		});
	},
};
