module.exports = {
	name: 'tips',
	description: 'Gives a tip of the bot!',
	category: 'general',
	aliases: [''],
	cooldown: 1.5,
	execute(message, args) {
		const prefix = require('discord-prefix');
		let guildPrefix = prefix.getPrefix(message.channel.type === 'GUILD_TEXT' ? message.guild.id : message.author.id);
		const tipslist = [
			'<:tips:800843897248546826> **TIP:** Our commands are not case sensitive, for exaple `!Duck` or `!dUck` would work',
			'<:tips:800843897248546826> **TIP:** \`NotBacon#4259\` is the creater of this bot',
			`<:tips:800843897248546826> **TIP:** Use \`${guildPrefix}help\` to see all the commands`,
			'<:tips:800843897248546826> **TIP:** We have a status page go to this link to see it: https://coolboibot.statuspage.io/',
			'<:tips:800843897248546826> **TIP:** We also have a mention prefix too',
			'<:tips:800843897248546826> **TIP:** Instead of mentioning people or roles you could use the user or role ID instead',
			'<:tips:800843897248546826> **TIP:** More tips comming soon!',

		];
		const tip = (Math.floor(Math.random() * Math.floor(tipslist.length)));
		message.reply({ content: `${tipslist[tip]}` });
	},
};