module.exports = {
	name: 'yeet',
	description: 'Sends a picture of a yeet',
  	cooldown: 1.5,
  	category: 'fun',
	execute(message, args) {
		message.channel.send({ content: 'https://tenor.com/view/yeet-lion-king-simba-rafiki-throw-gif-16194362', reply: { messageReference: message.id } });
	},
};