const db = require('quick.db');
module.exports = {
	name: 'block',
	description: 'Owner only; Description not avavible.',
	cooldown: 3,
	async execute(message, args, client) {
		if (message.author.id !== process.env.OWNER_ID || !args[0]) return;

		const user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);

		if (!user) {
			return await message.reply('User not found');
		}
		if (user.bot) {
			return await message.reply('User can\'t be a bot.');
		}
		db.set(`blockedusers_${user.id}`, true);

		return await message.reply({ content: `<:check:807305471282249738> Blocked ${user} from using commands` });
	},
};