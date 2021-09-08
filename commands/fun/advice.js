module.exports = {
	name: 'advice',
	description: 'Gives a word of advice!',
	cooldown: 1,
	category: 'fun',
	execute(message, args) {
		const request = require('node-superfetch');
		message.channel.sendTyping();
		request
			.get('http://api.adviceslip.com/advice')
			.end((err, res) => {
				if (!err && res.status === 200) {
					try {
						JSON.parse(res.text);
					}
					catch (e) {
						return message.channel.send({ content: 'An api error occurred.', reply: { messageReference: message.id } });
					}
					const advice = JSON.parse(res.text);
					setTimeout(() => {
						message.channel.send({ content: `📜  "${advice.slip.advice}"`, reply: { messageReference: message.id } });
					}, 750);
				}
				else {
					message.channel.send({ content: `Opps, well this is an error. If this continues dm <@765686109073440808>. \n \nSpeficic error: ${err}`, reply: { messageReference: message.id } });
					console.error(`REST call failed: ${err}, status code: ${res.status}`);
				}
			});
	},
};