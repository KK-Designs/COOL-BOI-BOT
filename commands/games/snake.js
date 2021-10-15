const { Snake } = require('discord-gamecord');
const color = require('../../color.json');
const gameOptions = {
	embed: {
		title: 'Snake Game',
		color: color.bot_theme,
		OverTitle: 'Game Over',
	},
	snake: { head: '🟢', body: '🟩', tail: '🟢' },
	emojis: {
		board: '⬛',
		food: '🍎',
		up: '⬆️',
		right: '➡️',
		down: '⬇️',
		left: '⬅️',
	},
	othersMessage: 'You are not allowed to use buttons for this message!',
};
module.exports = {
	name: 'snake',
	description: 'Play a game of snek! 🍎',
	aliases: ['snek'],
	cooldown: 5,
	category: 'games',
	options: {},
	execute(message) {
		new Snake({
			...gameOptions,
			message: message,
		}).startGame();
	},
	async executeSlash(interaction) {
		await interaction.deferReply();
		const message = {
			author: interaction.user,
			channel: {
				async send(option) {
					return await interaction.editReply(option);
				},
			},
		};
		new Snake({
			...gameOptions,
			message,
		}).startGame();
	},
};