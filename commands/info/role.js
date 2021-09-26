const { MessageEmbed } = require('discord.js');
const sendError = require('../../error.js');
module.exports = {
	name: 'role',
	description: 'Gets the mentioned role info!',
	usage: '[@role or role id]',
	guildOnly: true,
	cooldown: 5,
	category: 'info',
	clientPermissons: 'EMBED_LINKS',
	options: {
		role: {
			type: 'Role',
			description: 'The role to get the info of',
		},
	},
	async execute(message, args) {
		const member = message.author;
		if (!args[0]) {
			return sendError('Please mention a role. (i.e `!role @mod` or `!role 775153592537579550`)', message.channel);
		}
		const roleinfo = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
		const embed = new MessageEmbed()
			.setTitle(`${member.username}`)
			.setColor(roleinfo.hexColor)
			.setThumbnail(member.displayAvatarURL({ dynamic: true }))
			.addField('Role name: ', roleinfo.name, true)
			.addField('Role ID: ', roleinfo.id)
			.addField('Role Created: ', roleinfo.createdAt.toDateString(), true)
			.setFooter('Powered by the COOL BOI BOT', member.displayAvatarURL({ dynamic: true }))
			.setTimestamp();

		message.reply({ embeds: [embed] });
	},
	async executeSlash(interaction) {
		const user = interaction.user;
		const role = interaction.options.getRole('role', true);
		const embed = new MessageEmbed()
			.setTitle(`${user.username}`)
			.setColor(role.hexColor)
			.setThumbnail(user.displayAvatarURL({ dynamic: true }))
			.addField('Role name: ', role.name, true)
			.addField('Role ID: ', role.id)
			.addField('Role Created: ', role.createdAt.toDateString(), true)
			.setFooter('Powered by the COOL BOI BOT', user.displayAvatarURL({ dynamic: true }))
			.setTimestamp();

		await interaction.reply({ embeds: [embed] });
	},
};