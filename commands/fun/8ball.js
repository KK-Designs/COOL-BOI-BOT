const { spoiler } = require('@discordjs/builders');
const { setTimeout: delay } = require('timers/promises');
const eightball = [
	'It is certain',
	'It is decidedly so',
	'Without a doubt',
	'Yes - definitely',
	'You may rely on it',
	'As I see it, yes',
	'Most likely',
	'Outlook good',
	`${spoiler('Yes')}`,
	`${spoiler('No')}`,
	'Signs point to yes',
	'Don\'t count on it',
	'My reply is no',
	'My sources say no',
	'Outlook not so good',
	'Very doubtful',
	'Reply hazy, try again',
	'Ask again later',
	'Better not tell you now',
	'Cannot predict now',
	'Concentrate and ask again',
];
module.exports = {
	name: '8ball',
	description: 'A magic 8ball command 🎱',
	usage: '[question]',
	category: 'fun',
	cooldown: 3,
	options: {
		question: {
			type: 'String',
			description: 'The question to ask',
		},
	},
	async execute(message, args) {
		if (!args[0]) {
			return await message.reply({ content: 'Please ask me a question.' });
		}
		await message.replyTyping();
		const index = Math.floor(Math.random() * Math.floor(eightball.length));
		await delay(750);
		await message.reply({ content: `${eightball[index]}` });

	},
	async executeSlash(interaction) {
		const index = Math.floor(Math.random() * eightball.length);
		await interaction.deferReply();
		await delay(750);
		await interaction.editReply({
			content: `${eightball[index]}`,
		});
	},
};