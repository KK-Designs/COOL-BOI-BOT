module.exports = {
	name: 'user-info',
	description: 'Gets the mentioned user\'s info!',
	usage: '(@user or userid)',
	guildOnly: true,
	aliases: ['who-is'],
	cooldown: 3,
	category: 'info',
	clientPermissons: 'EMBED_LINKS',
	async execute(message, args, client) {		
		const { MessageEmbed, UserFlags , User } = require('discord.js');		
		let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);		

		if (!args[0]) {
			member = message.member || message.author;
		}

		let user = new User(client, member);
		const roles = member.roles.cache.map(role => role.toString());
		let color = member.displayHexColor;
		if (color == '#000000') color = '#C0C0C0';		
		let badges;
		let owner;
		let status;
		await message.guild.fetchOwner().then(res => owner = res);
		console.log(owner)		
		if (member.user.flags.toArray().includes("HOUSE_BALANCE")) {
			badges = "<:HOUSE_BALANCE:885673359537500180>  "
		}
		else if (member.user.flags.toArray().includes("HOUSE_BRAVERY")) {
			badges = "<:HOUSE_BRAVERY:885673359579426856>  "
		}
		else if (member.user.flags.toArray().includes("HOUSE_BRILLIANCE")) {
			badges = "<:HOUSE_BRILLIANCE:885673359600406598>  "
		} else {
			badges = "None"
		}
		if (member.id === client.user.id) {
			badges = "<:VERIFIED_BOT:885673359474569226>  "
		}
		if (member.id === owner.user.id) {
			badges = `${badges}<:serverowner:885673359885606942>  `;
		}
		
		if (!member.presence) {
			status = '<:offline:806216568660164659> Offline';
		}
		else if (member.presence.status === 'online') {
			status = '<:online:806215585415168040> Online';
		}
		else if (member.presence.status === 'dnd') {
			status = '<:dnd:806215804773335120> Do not disturb';
		}
		else if (member.presence.status === 'idle') {
			status = '<:Idle:806215585267712062> Idle';
		}		
		const embed = new MessageEmbed()
			.setTitle(`${member.user.username}`)
			.setColor(color)
			.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
			.addField('Username', member.user.tag)
			.addField('ID', member.id, true)
			.addField('Account Created', `<t:${Math.floor(member.user.createdAt / 1000)}:f>`, true)
			.addField('Joined Server', `<t:${Math.floor(member.joinedAt / 1000)}:f>`, true)
			.addField('Current VC: ', member.voice.channel == null ? 'None' : `<:voice_channel:804772497684693052> ${member.voice.channel.name}`, true)
			.addField('Status: ', `${status}`, true)			
			.addField('Roles: ', roles.join(' **|** '), true)
			.addField('Badges: ', badges, true)
			.setFooter('Powered by the COOL BOI BOT', member.user.displayAvatarURL({ dynamic: true }))
			.setTimestamp();

		message.channel.send({ embeds: [ embed ], reply: { messageReference: message.id } });
	},
};