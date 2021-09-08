module.exports = {
	name: 'coinflip',
	description: 'Flips a coin!',
	cooldown: 2,
	category: 'general',
	execute(message, args) {
		const random = (Math.floor(Math.random() * Math.floor(2)));
		if (random === 0) {
			message.channel.send({ content: 'I flipped heads!', reply: { messageReference: message.id } });
		}
		else {
			message.channel.send({ content: 'I flipped tails!', reply: { messageReference: message.id } });
		}
	},
};