const { Trivia } = require('discord-gamecord');
const color = require('../../color.json');
const sendError = require('../../error.js');
const difficulties = [
	'easy',
	'medium',
	'hard',
];
const gameOptions = {
	embed: {
		title: 'Trivia',
		description: '🕓 You have {time} seconds to respond!',
		color: color.bot_theme,
	},
	time: 60000,
	buttons: {
		one: '1️⃣',
		two: '2️⃣',
		three: '3️⃣',
		four: '4️⃣',
	},
	winMessage: '<:check:807305471282249738> Your answer was correct! You answered **{answer}**',
	loseMessage: '<:X_:807305490160943104> Your answer was Incorrect! The correct answer was **{answer}**',
	othersMessage: '<:X_:807305490160943104> You are not allowed to use buttons for this message!',
};
module.exports = {
	name: 'trivia',
	description: 'Play a game of trivia! ❔',
	usage: '[difficulty]',
	cooldown: 5,
	category: 'games',
	options: {
		difficulty: {
			type: 'String',
			description: 'The difficulty of the game',
			choices: difficulties.reduce((obj, d) => ({ ...obj, [d[0].toUpperCase() + d.slice(1)]: d }), {}),
		},
		user: {
			type: 'User',
			description: 'The user you want to challenge',
		},
	},
	async execute(message, args) {
		if (!args[0]) {return sendError('You need to specify a difficulty', message.channel);}

		if (!difficulties.includes(args[0].toLowerCase())) {return sendError('Please provide a valid difficulty', message.channel);}

		new Trivia({
			...gameOptions,
			message: message,
			opponent: message.mentions.users.first(),
			difficulty: args[0],
		}).startGame();
	},
	async executeSlash(interaction) {
		const difficulty = interaction.options.getString('difficulty', true);
		if (!difficulties.includes(difficulty)) {return await message.reply('Please provide a valid difficulty');}
		const user = interaction.options.getUser('user', true);
		await interaction.deferReply();
		const message = {
			author: interaction.user,
			channel: {
				async send(option) {
					return await interaction.editReply(option);
				},
			},
		};
		new Trivia({
			...gameOptions,
			message,
			opponent: user,
			difficulty: difficulty,
		}).startGame();
	},
};
