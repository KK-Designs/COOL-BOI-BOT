const figlet = require('figlet');
module.exports = {
	name: 'ascii',
	description: 'Generate some ascii text',
	cooldown: 2,
	category: 'fun',
	options: {
		text: {
			type: 'String',
			description: 'The text to convert to ASCII',
		},
	},
	async execute(message, args) {
		const asciitext = args.slice(0).join(' ');
		if (!asciitext) {
			return await message.reply({ content: 'You didn\'t give me the text! please use the command like so: `/ascii bacon`' });
		}
		figlet(asciitext, async (err, data) => {
			if (err) {
				if (asciitext.length >= 2000) {
					return await message.reply({ content: 'I can\'t send messages longer than 2000 characters.' });
				}
			}
			await message.reply({ content: `Here is your ascii text:\n\`\`\`${data}\`\`\`` });
		});
	},
	async executeSlash(interaction) {
		const asciitext = interaction.options.getString('text', true);

		if (asciitext.length >= 2000) {return await interaction.reply('The text option is too long');}

		const data = await new Promise((res, rej) => figlet(asciitext, (err, result) => (err ? rej(err) : res(result))));

		if (data.length >= 2000) {return await interaction.reply('The resulting message is too long');}

		await interaction.reply({ content: `Here is your ascii text:\n\`\`\`${data}\`\`\`` });
	},
};
