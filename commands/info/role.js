module.exports = {
	name: 'role',
	description: 'Gets the mentioned role info!',
	usage: '[@role or role id]',
	guildOnly: true,
	cooldown: 5,
	category: 'info',
	clientPermissons: 'EMBED_LINKS',
	execute(message, args) {
		const sendError = require('../../error.js');
		const member = message.author;
		if (!args[0]) {
			return sendError('Please mention a role. (i.e `!role @mod` or `!role 775153592537579550`)', message.channel);
		}
		const { MessageEmbed } = require('discord.js');
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

		message.channel.send({ embeds: [embed], reply: { messageReference: message.id } });
	},
};