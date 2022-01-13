const fs = require('fs');
const { MessageAttachment } = require('discord.js');
const sendError = require('../../error.js');
module.exports = {
	name: 'num',
	description: 'Gives you a count of the specified number!',
	usage: '[number]',
	cooldown: 3,
	category: 'fun',
	clientPermissons: 'ATTACH_FILES',
	options: {
		number: {
			type: 'Integer',
			description: 'The number',
		},
	},
	async execute(message, args) {
		if (!args[0]) {
			return sendError('Please enter a valid number', message.channel);
		}
		const numamount = parseInt(args[0]) + 1;

		if (isNaN(numamount)) {
			return sendError(
				'that doesn\'t seem to be a valid number.',
				message.channel,
			);
		}
		if (!fs.existsSync(`./1-${args}.txt`)) {
			// file exists
			return await message.reply('You are using an unsupported number. The supported numbers are 100, 1000, 10000, 100000, 1000000.  More coming soon!');
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
		await message.reply({ content: `${message.author}, here is the numbers 1-${args}`, files: [attachment] });

	},
	async executeSlash(interaction) {
		const numamount = interaction.options.getInteger('number', true);
		const filepath = `./1-${numamount}.txt`;

		if (!fs.existsSync(filepath)) {
			return await interaction.reply('You are using an unsupported number. The supported numbers are 100, 1000, 10000, 100000, 1000000.  More coming soon!');
		}
		const attachment = new MessageAttachment(filepath, `1-${numamount}.txt`);

		await interaction.reply({ content: `${interaction.user}, here is the numbers 1-${numamount}`, files: [attachment] });
	},
};
