module.exports = {
	name: 'setprefix',
	description: 'Set the bots prefix!',
	cooldown: 5,
	permissions: 'ADMINISTRATOR',
	usage: '[prefix]',
	guildOnly: true,
	category: 'util',
	execute(message, args) {
		const prefix = require('discord-prefix');
		const guild = message.guild;
		if (!args.length) {
			setTimeout(() => { prefix.setPrefix('!', guild.id); }, 700);
			return message.channel.send({ content: 'Reset the bots prefix to `!`', reply: { messageReference: message.id } });
		}
		else if (parseInt(args[0].length) > 3) {
			return message.channel.send({ content: 'I can\'t set the prefix to anything more than 3', reply: { messageReference: message.id } });
		}
		else {
			message.channel.send({ content: `Prefix was succesfully changed to ${args[0]}\n\n *you can check the new prefix by running '<@769415264306987068> prefix'*`, reply: { messageReference: message.id } });
			setTimeout(() => { prefix.setPrefix(args[0], guild.id); }, 700);
		}
	},
};