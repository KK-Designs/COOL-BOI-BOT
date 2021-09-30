module.exports = {
	name: 'snake',
	description: 'Play a game of snek! 🍎',
	aliases: ['snek'],
	cooldown: 5,
	category: 'games',
	execute(message) {
		const { Snake } = require('discord-gamecord');
		const color = require('../../color.json');

		new Snake({
			message: message,
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
		}).startGame();
	},
};