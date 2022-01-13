module.exports = {
	name: 'calc',
	description: 'Calculate the provided expression ➕',
	cooldown: 3,
	category: 'other',
	execute(message, args, client) {
		const simplydjs = require('simply-djs');
		const color = require('../../color.json');
		simplydjs.calculator(message, {
			embedColor: color.bot_theme, // default: #075FFF
			credit: false,
		});
	},
};
