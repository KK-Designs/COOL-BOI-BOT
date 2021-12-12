const { MessageEmbed } = require('discord.js');
const sendError = require('../../error.js');
module.exports = {
	name: 'addrole',
	description: 'Add a role to the specified user',
	cooldown: 3,
	usage: '[role name or id] (@user)',
	permissions: 'MANAGE_ROLES',
	clientPermissons: 'MANAGE_ROLES',
	category: 'moderation',
	options: {
		role: {
			type: 'Role',
			description: 'The role to add to the user',
		},
		user: {
			type: 'User',
			description: 'The user to add the role to',
			required: false,
		},
	},
	async execute(message, args) {

		const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
		const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.member;
		if (!role) {return sendError('Please provide a valid role', message.channel);}

		if (member.roles.cache.has(role.id)) {
			return await message.reply({
				embeds: [
					new MessageEmbed()
						.setColor('RED')
						.setDescription(`<:X_:807305490160943104> ${member} already has the role ${role}`),
				],
			});
		}
		// Add the role!
		await member.roles.add(role);
		await message.reply({
			embeds: [
				new MessageEmbed()
					.setColor('GREEN')
					.setDescription(`<:check:807305471282249738> Added the role ${role} to ${member}`),
			],
		});
	},
	async executeSlash(interaction) {
		const role = interaction.options.getRole('role');
		const member = interaction.options.getMember('user') ?? interaction.member;

		if (member.roles.cache.has(role.id)) {
			return await interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor('RED')
						.setDescription(`<:X_:807305490160943104> ${member} already has the role ${role}`),
				],
			});
		}
		// Add the role!
		await member.roles.add(role);
		await interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor('GREEN')
					.setDescription(`<:check:807305471282249738> Added the role ${role} to ${member}`),
			],
		});
	},
};