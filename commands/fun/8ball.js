const eightball = [
	'It is certain.',
	'It is decidedly so.',
	'Without a doubt.',
	'Yes definitely.',
	'You may rely on it.',
	'As I see it, yes.',
	'Most likely.',
	'Outlook good.',
	'Yes.',
	'Signs point to yes.',
	'Reply hazy try again.',
	'Ask again later.',
	'Better not tell you now.',
	'Cannot predict now.',
	'Concentrate and ask again.',
	'Don\'t count on it.',
	'My reply is no.',
	'||<a:rickroll:805174355797082132>||',
	'My sources say no.',
	'Outlook not so good.',
	'Very doubtful.',
	'No way.',
	'Maybe',
	'The answer is hiding inside you',
	'No.',
	'Depends on the mood of the CS god',
	'||No||',
	'||Yes||',
	'Hang on',
	'It\'s over',
	'It\'s just the beginning',
	'Good Luck',
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
	execute(message, args) {
		if (!args[0]) {
			return message.reply({ content: 'Please ask me a question.' });
		}
		message.channel.sendTyping();
		const index = Math.floor(Math.random() * Math.floor(eightball.length));
		setTimeout(() => {
			message.channel.send({ content: `${eightball[index]}` });
		}, 750);

	},
	async executeSlash(interaction) {
		const wait = require('util').promisify(setTimeout);
		const index = Math.floor(Math.random() * eightball.length);
		await interaction.deferReply();
		await wait(750);
		await interaction.reply({
			content: `${eightball[index]}`,
			ephemeral: true,
		});
	},
};