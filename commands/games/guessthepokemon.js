const color = require('../../color.json');
const { GuessThePokemon } = require('discord-gamecord');
const gameOptions = {
	embed: {
		title: 'Who\'s This Pokemon?',
		footer: 'COOL BOI BOT Games',
		color: color.bot_theme,
	},
	time: 60000,
	othersMessage: '<:X_:807305490160943104> You are not allowed to use buttons for this message!',
	winMessage: '<:check:807305471282249738> Your guess was correct! The pokemon was **{pokemon}**',
	stopMessage: '<:check:807305471282249738> I have stopped the game! It was a **{pokemon}** if you were wondering',
	incorrectMessage: '<:X_:807305490160943104> Your guess was incorrect! The pokemon was **{pokemon}**',
};
module.exports = {
	name: 'guessthepokemon',
	description: 'Play a game of guess the pokemon!',
	aliases: ['gtp', 'gp'],
	cooldown: 5,
	category: 'games',
	options: {},
	async execute(message) {
		new GuessThePokemon({
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
		new GuessThePokemon({
			...gameOptions,
			message: message,
		}).startGame();
	},
};
