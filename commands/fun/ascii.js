module.exports = {
	name: 'ascii',
	description: 'Generate some ascii text',
	cooldown: 2,
	category: 'fun',
	execute(message, args) {
		const	figlet = require('figlet');
		const asciitext = args.slice(0).join(' ');
		figlet(asciitext, function(err, data) {
			if (!asciitext) {
				message.channel.send({ content: 'You didn\'t give me the text! please use the command like so; \`!ascii bacon\`', reply: { messageReference: message.id } });
			}
			else if (asciitext.length >= 2000) {
				return message.channel.send({ content: 'I can\'t send messages longer than 2000 characters.', reply: { messageReference: message.id } });
			}
			message.channel.send({ content: `Here is your ascii text:\n\`\`\`${data}\`\`\``, reply: { messageReference: message.id } });
		});
	},
};