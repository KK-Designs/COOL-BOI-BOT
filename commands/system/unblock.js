const db = require('quick.db');
module.exports = {
	name: 'unblock',
	description: 'Owner only; Description not avavible.',
	cooldown: 3,
	async execute(message, args, client) {
		const user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);

		if (!user) {
			return await message.reply('User not found');
		}
		if (user.bot) {
			return await message.reply('User can\'t be a bot.');
		}
		db.delete(`blockedusers_${user.id}`);

		return await message.reply({ content: `<:check:807305471282249738> Unblocked ${user} from using commands` });
	},
};
