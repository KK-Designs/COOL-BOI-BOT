module.exports = {
	name: 'block',
	description: 'Owner only; Description not avavible.',
	cooldown: 3,
	async execute(message, args, client) {
		const db = require('quick.db');
		if (message.author.id !== process.env.OWNER_ID || !args[0]) return;
		const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
     	db.set(`blockedusers_${client.user.id}`, member.id);
		message.channel.send({ content: `<:check:807305471282249738> Blocked ${member} from using commands` });

	},
};