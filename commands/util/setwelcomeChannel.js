module.exports = {
	name: 'setwelcomechannel',
	description: 'Set the bots welcome channel. do `!setwelcomeChannel none` to reset this config',
	cooldown: 5,
	guildOnly: true,
	permissions: 'ADMINISTRATOR',
	usage: '[prefix]',
	category: 'util',
	options: {},
	async execute(message, args, client) {
	 const db = require('quick.db');
		const x = /* message.channel ||*/
            message.mentions.channels.first() ||
            message.guild.channels.cache.find(channel => channel.name === args[0]) || message.guild.channels.cache.get(args[0]);

		if (args[0].toLowerCase() === 'none') {
			message.channel.send({ content: 'Stopped logging welcome members.' });

			return db.set(`welcomechannel_${message.guild.id}`, '0');
		}
		if (!x) {return message.reply({ content: 'Please specify the channel.' });}

		await db.set(`welcomechannel_${message.guild.id}`, x.id);
		message.reply({ content: `Succesfuly set welcome channel to ${x}` });

	},
};