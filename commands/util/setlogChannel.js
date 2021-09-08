module.exports = {
	name: 'setlogchannel',
	description: 'Set the bots audit logging channel. Do `setlogChannel none` to reset this config',
	cooldown: 5,
	guildOnly: true,
	permissions: 'ADMINISTRATOR',
	usage: '[prefix]',
	category: 'util',
	async execute(message, args, client) {
	 const db = require('quick.db');
		const x = /* message.channel ||*/
            message.mentions.channels.first() ||
            message.guild.channels.cache.find(channel => channel.name === (args[0])) || message.guild.channels.cache.get(args[0]);

		if (args[0].toLowerCase() === 'none') {
			message.channel.send('Stopped logging events.');
			return db.set(`loggingchannel_${message.guild.id}`, '0');
		}

		if (!x) return message.channel.send({ content: 'Please specify the channel.', reply: { messageReference: message.id } });

		await db.set(`loggingchannel_${message.guild.id}`, x.id);
		message.channel.send({ content: `Succesfuly set logging channel to ${x}`, reply: { messageReference: message.id } });

	},
};