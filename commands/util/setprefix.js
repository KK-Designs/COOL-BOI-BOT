module.exports = {
	name: 'setprefix',
	description: 'Set the bots prefix!',
	cooldown: 5,
	permissions: 'ADMINISTRATOR',
	usage: '[prefix]',
	guildOnly: true,
	category: 'util',
	options: {},
	async execute(message, args) {
		const prefix = require('discord-prefix');
		const guild = message.guild;

		if (!args.length) {
			prefix.setPrefix('!', guild.id);

			return message.reply({ content: 'Reset the bots prefix to `!`' });
		}
		else if (parseInt(args[0].length) > 3) {
			return message.reply({ content: 'I can\'t set the prefix to anything more than 3' });
		}
		message.reply({ content: `Prefix was succesfully changed to ${args[0]}\n\n *you can check the new prefix by running '<@769415264306987068> prefix'*` });
		setTimeout(() => { prefix.setPrefix(args[0], guild.id); }, 700);

	},
};