module.exports = {
	name: '8ball',
	description: 'A magic 8ball command 🎱',
	usage: '[question]',
	category: 'fun',
	cooldown: 3,
	execute(message, args) {
		if (!args[0]) {
			return message.channel.send({ content: 'Please ask me a question.', reply: { messageReference: message.id } });
		}
		else {
			message.channel.sendTyping();
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
			const index = (Math.floor(Math.random() * Math.floor(eightball.length)));
			setTimeout(() => {
				message.channel.send({ content: `${eightball[index]}` });
			}, 750);
		}
	},
};