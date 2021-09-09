module.exports = {
	name: 'user-info',
	description: 'Gets the mentioned user\'s info!',
	usage: '(@user or userid)',
	guildOnly: true,
	aliases: ['who-is'],
	cooldown: 3,
	category: 'info',
	clientPermissons: 'EMBED_LINKS',
	execute(message, args) {		
		const { MessageEmbed } = require('discord.js');
		let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		if (!args[0]) {
			member = message.member || message.author;
		}

		const roles = member.roles.cache.map(role => role.toString());
		let color = member.displayHexColor;
		if (color == '#000000') color = '#C0C0C0';
		let status = "<:offline:806216568660164659> Unavailable";
		/*if (member.presence.status === 'online') {
			status = '<:online:806215585415168040> Online';
		}
		else if (member.presence.status === 'dnd') {
			status = '<:dnd:806215804773335120> Do not disturb';
		}
		else if (member.presence.status === 'idle') {
			status = '<:Idle:806215585267712062> Idle';
		}
		else if (member.presence.status === 'offline') {
			status = '<:offline:806216568660164659> offline';
		}*/

		const embed = new MessageEmbed()
			.setTitle(`${member.user.username}`)
			.setColor(color)
			.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
			.addField('Username', member.user.tag)
			.addField('ID', member.id, true)
			.addField('Account Created', `<t:${Math.floor(member.user.createdAt / 1000)}:f>`, true)
			.addField('Joined Server', `<t:${Math.floor(member.joinedAt / 1000)}:f>`, true)
			.addField('Current VC: ', member.voice.channel == null ? 'None' : `<:voice_channel:804772497684693052> ${member.voice.channel.name}`, true)
			.addField('Status: ', status, true)
			.addField('Roles', roles.join(' **|** '), true)
			.setFooter('Powered by the COOL BOI BOT', member.user.displayAvatarURL({ dynamic: true }))
			.setTimestamp();

		message.channel.send({ embeds: [ embed ], reply: { messageReference: message.id } });
	},
};