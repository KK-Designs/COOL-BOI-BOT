module.exports = {
	name: 'removerole',
	description: 'Remove a role to the specified user',
	cooldown: 3,
	category: 'moderation',
	usage: '[role name or id] (@user or id)',
	permissions: 'MANAGE_ROLES',
	clientPermissons: 'MANAGE_ROLES',
	async execute(message, args, client) {
		const { MessageEmbed } = require('discord.js');
		const sendError = require('../../error.js');
		const role =
			message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);

		const member =
			message.mentions.members.last() ||
			(await client.users.fetch(args[1])) ||
			message.member;

		if (!role) return sendError('Please provide a valid role', message.channel);

		if (!member.roles.cache.has(role.id)) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor('RED')
						.setDescription(
							`<:X_:807305490160943104> ${member} doesn\'t have the role ${role}`,
						),
				],
			});
		}
		// Remove the role!
		member.roles.remove(role).catch(console.error);
		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor('GREEN')
					.setDescription(
						`<:check:807305471282249738> Removed the role ${role} from ${member}`,
					),
			],
			reply: { messageReference: message.id },
		});
	},
};
