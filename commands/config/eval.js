module.exports = {
	name: 'eval',
	description: 'eval',
	cooldown: 2,
	guildOnly: true,
	category: 'config',
	options: {
		statement: {
			type: 'String',
			description: 'The statement to evaluate',
		},
	},
	/**
   *
   * @param {import("discord.js").Message} message
   * @param {*} args
   * @param {*} client
   * @returns
   */
	async execute(message, args) {
		console.log('Eval command async executed.');
		if (message.author.id !== process.env.OWNER_ID) {return await message.reply('You try to use the eval command? Straight to jail.');}

		try {
			let evaled = await eval(args.join(' '));
			if (typeof evaled !== 'string') {evaled = require('util').inspect(evaled);}

			await message.reply({ content: code(evaled.slice(0, 1990), 'js') });
		}
		catch (err) {
			console.log(err);
			await message.reply(`\`ERROR\` ${code(err)}`);
		}
	},
	async executeSlash(interaction) {
		const args = interaction.options.getString('statement', true);
		console.log('Eval command async executed.');
		if (interaction.member.id !== process.env.OWNER_ID) {return await interaction.reply('You try to use the eval command? Straight to jail.');}

		try {
			let evaled = await eval(args);
			const wait = require('util').promisify(setTimeout);
			if (typeof evaled !== 'string') {evaled = require('util').inspect(evaled);}
			await interaction.deferReply();
			await wait(1000);
			await interaction.editReply({ content: code(evaled.slice(0, 1990), 'js') });
		}
		catch (err) {
			console.log(err);
			await interaction.reply(`\`ERROR\` ${code(err)}`);
		}
	},
};
function code(text, lang = 'xl') {
	return '```' + `${lang}\n${text}\n` + '```';
}