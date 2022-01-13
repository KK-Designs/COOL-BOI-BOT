const { MessageEmbed } = require('discord.js');
const sendError = require('../../error.js');
module.exports = {
	name: 'removerole',
	description: 'Remove a role to the specified user',
	cooldown: 3,
	category: 'moderation',
	usage: '[role name or id] (@user or id)',
	permissions: 'MANAGE_ROLES_OR_PERMISSIONS',
	clientPermissons: 'MANAGE_ROLES_OR_PERMISSIONS',
	options: {
		role: {
			type: 'Role',
			description: 'The role to remove',
		},
		user: {
			type: 'User',
			description: 'The user to remove the role from',
			required: false,
		},
	},
	async execute(message, args) {

		const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
		const member = message.mentions.members.last() || message.guild.members.cache.get(args[0]) || message.member;
		if (!role) {return sendError('Please provide a valid role', message.channel);}

		if (!member.roles.cache.has(role.id)) {
			return await message.reply({
				embeds: [
					new MessageEmbed()
						.setColor('RED')
						.setDescription(`<:X_:807305490160943104> ${member} doesn't have the role ${role}`),
				],
			});
		}
		// Add the role!
		member.roles.remove(role).catch(console.error);
		await message.reply({
			embeds: [
				new MessageEmbed()
					.setColor('GREEN')
					.setDescription(`<:check:807305471282249738> Removed the role ${role} from ${member}`),
			],
		});
	},
	async executeSlash(interaction) {
		const role = interaction.options.getRole('role', true);
		const member = interaction.options.getMember('user') ?? interaction.member;

		if (!member.roles.cache.has(role.id)) {
			return await interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor('RED')
						.setDescription(`<:X_:807305490160943104> ${member} doesn't have the role ${role}`),
				],
			});
		}
		// Remove the role!
		await member.roles.remove(role);
		await interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor('GREEN')
					.setDescription(`<:check:807305471282249738> Removed the role ${role} from ${member}`),
			],
		});
	},
};
