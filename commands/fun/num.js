module.exports = {
	name: 'num',
	description: 'Gives you a count of the specified number!',
	usage: '[number]',
	cooldown: 3,
	category: 'fun',
	clientPermissons: 'ATTACH_FILES',
	execute(message, args) {
		const fs = require('fs');
		const { Client, MessageAttachment } = require('discord.js');
		const sendError = require('../../error.js');
		 if (!args[0]) {
			return sendError('Please enter a valid number', message.channel);
		}

		const numamount = parseInt(args[0]) + 1;
		if (isNaN(numamount)) {
			return sendError('that doesn\'t seem to be a valid number.', message.channel);
		}

		try {
			if (!fs.existsSync(`./1-${args}.txt`)) {
				// file exists
				return message.channel.send('You are using an unsupported number. The supported numbers are 100, 1000, 10000, 100000, 1000000.  More coming soon!');
			}
			// Get the buffer from the 'memes.txt', assuming that the file exists
			const buffer = fs.readFileSync(`./1-${args}.txt`);

			/**
           * Create the attachment using MessageAttachment,
           * overwritting the default file name to 'memes.txt'
           * Read more about it over at
           * http://discord.js.org/#/docs/main/master/class/MessageAttachment
           */
			const attachment = new MessageAttachment(buffer, `1-${args}.txt`);
			// Send the attachment in the message channel with a content
			message.channel.send({ content: `${message.author}, here is the numbers 1-${args}`, files: [attachment], reply: { messageReference: message.id } });
		}
		catch (err) {
			sendError(`Oops, well this is an error. If this continues dm <@765686109073440808>. \n \nSpeficic error: ${err}`, message.channel);
		}
	},
};