module.exports = {
	name: 'addrole',
	description: 'Add a role to the specified user',
	cooldown: 3,
	usage: '[role name or id] (@user)',
	permissions: 'MANAGE_ROLES',
	clientPermissons: 'MANAGE_ROLES',
	category: 'moderation',
	async execute(message, args, client) {
		const { MessageEmbed } = require('discord.js');
		const sendError = require('../../error.js');
		const UTILS = require('../../utils.js');
		const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
		const member = message.mentions.members.last() || message.guild.members.cache.get(args[0]) || message.member;

		if (!role) return sendError('Please provide a valid role', message.channel);

		if (member.roles.cache.has(role.id)) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor('RED')
						.setDescription(`<:X_:807305490160943104> ${member} already has the role ${role}`),
				],
			});
		}

		// Add the role!
		member.roles.add(role).catch(console.error);
		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor('GREEN')
					.setDescription(`<:check:807305471282249738> Added the role ${role} to ${member}`),
			], reply: { messageReference: message.id },
		});
	},
};