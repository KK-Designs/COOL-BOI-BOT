module.exports = {
	name: 'server',
	description: 'Gets the server info',
	guildOnly: true,
	cooldown: 3,
	category: 'info',
	clientPermissons: 'EMBED_LINKS',
	execute(message, args) {
		const guild = message.guild;
		const { MessageEmbed } = require('discord.js');
		const serverName = guild.name;
		const serverIcon = message.guild.iconURL();
		const infoembed = new MessageEmbed()
			.setColor(message.guild.me.displayHexColor)
			.setTitle('Server Info')
			.setThumbnail(serverIcon)
			.setDescription(`${message.guild}'s information`)
			.addField('Owner', `The owner of this server is ${message.guild.owner}`)
			.addField('Server ID: ', guild.id)
			.addField('Server Created: ', guild.createdAt.toDateString())
			.addField('Member Count', `This server has ${message.guild.memberCount} members`)
			.addField('Emoji Count', `This server has ${message.guild.emojis.cache.size} emojis`)
			.addField('Roles Count', `This server has ${message.guild.roles.cache.size} roles`)
			.setFooter(serverName, serverIcon);

		message.channel.send({ embeds: [ infoembed ], reply: { messageReference: message.id } });
	},
};