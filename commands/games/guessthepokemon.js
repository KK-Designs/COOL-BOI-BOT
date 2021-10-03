module.exports = {
	name: 'guessthepokemon',
	description: 'Play a game of guess the pokemon!',
	aliases: ['gtp', 'gp'],
	cooldown: 5,
	category: 'games',
	execute(message) {
		const color = require('../../color.json');
		const { GuessThePokemon } = require('discord-gamecord');
		new GuessThePokemon({
			message: message,
			embed: {
				title: 'Who\'s This Pokemon?',
				footer: `${message.client.user.username} Games`,
				color: color.bot_theme,
			},
			time: 60000,
			othersMessage: '<:X_:807305490160943104> You are not allowed to use buttons for this message!',
			winMessage: '<:check:807305471282249738> Your guess was correct! The pokemon was **{pokemon}**',
			stopMessage: '<:check:807305471282249738> I have stopped the game! It was a **{pokemon}** if you were wondering',
			incorrectMessage: '<:X_:807305490160943104> Your guess was incorrect! The pokemon was **{pokemon}**',
		}).startGame();
	},
};