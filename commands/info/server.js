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
		const serverIcon = guild.iconURL();
		guild.fetchOwner().then((owner) => {
			const infoembed = new MessageEmbed()
				.setColor(guild.me.displayHexColor)
				.setTitle('Server Info')
				.setThumbnail(serverIcon)
				.setDescription(`${guild}'s information`)
				.addField('Owner', `The owner of this server is ${owner}`)
				.addField('Server ID: ', guild.id)
				.addField(
					'Server Created: ',
					`<t:${Math.floor(guild.createdTimestamp / 1000)}:f>`,
				)
				.addField(
					'Member Count',
					`This server has ${guild.memberCount} members`,
				)
				.addField(
					'Emoji Count',
					`This server has ${guild.emojis.cache.size} emojis`,
				)
				.addField(
					'Roles Count',
					`This server has ${guild.roles.cache.size} roles`,
				)
				.setFooter(serverName, serverIcon);

			message.channel.send({
				embeds: [infoembed],
				reply: { messageReference: message.id },
			});
		});
	},
};
