const color = require('../../color.json');
const { Connect4 } = require('discord-gamecord');
const gameOptions = {
	embed: {
		title: 'Connect 4',
		color: color.bot_theme,
	},
	emojis: {
		player1: '🔴',
		player2: '🟡',
	},
	turnMessage: '{emoji} | Its now **{player}** turn!',
	winMessage: '{emoji} | **{winner}** won the game!',
	gameEndMessage: 'The game went unfinished :(',
	drawMessage: 'It was a draw!',
	askMessage: 'Hey {opponent}, {challenger} challenged you for a game of Connect 4!',
	cancelMessage: 'Looks like they refused to have a game of Connect4. :(',
	timeEndMessage: 'Since the opponent didnt answer, i dropped the game!',
};
module.exports = {
	name: 'connect4',
	description: 'Play a game of connect four!',
	cooldown: 5,
	category: 'games',
	options: {
		user: {
			type: 'User',
			description: 'The user you wan\'t to challenge',
		},
	},
	execute(message) {
		new Connect4({
			...gameOptions,
			message: message,
			opponent: message.mentions.users.first(),
		}).startGame();
	},
	async executeSlash(interaction) {
		await interaction.deferReply();
		const user = await interaction.options.getUser('user', true);
		const message = {
			author: interaction.user,
			channel: {
				async send(option) {
					return await interaction.editReply(option);
				},
			},
		};
		new Connect4({
			...gameOptions,
			message: message,
			opponent: user,
		}).startGame();
	},
};