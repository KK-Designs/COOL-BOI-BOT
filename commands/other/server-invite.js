module.exports = {
	name: 'server-invite',
	description: 'Gets your server\'s permanent invite link!',
	guildOnly: true,
	cooldown: 7.5,
	category: 'other',
	async execute(message, args) {
		const invite = await message.channel
			.createInvite({
				maxAge: 0, // 0 = infinite expiration
				maxUses: 0, // 0 = infinite uses
			})
			.catch(console.error);
		message.channel.send({
			content: `Here is the server invite link (permanent): ${invite}`,
			reply: { messageReference: message.id },
		});
	},
};
