const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const { bold, inlineCode } = require('@discordjs/builders');
const statuses = {
	online: '<:online:806215585415168040> Online',
	dnd: '<:dnd:806215804773335120> Do not disturb',
	idle: '<:Idle:806215585267712062> Idle',
	offline: '<:offline:806216568660164659> Offline',
};
/** @type {Record<import("discord.js").UserFlagsString & `HOUSE_${string}`, string>} */
const allBadges = {
	HOUSE_BALANCE: '<:HOUSE_BALANCE:885673359537500180>',
	HOUSE_BRAVERY: '<:HOUSE_BRAVERY:885673359579426856>',
	HOUSE_BRILLIANCE: '<:HOUSE_BRILLIANCE:885673359600406598>',
};
module.exports = {
	name: 'user-info',
	description: 'Gets the mentioned user\'s info!',
	usage: '(@user or userid)',
	guildOnly: true,
	aliases: ['who-is'],
	cooldown: 3,
	category: 'info',
	clientPermissons: 'EMBED_LINKS',
	options: {
		user: {
			type: 'User',
			description: 'The user to get the info of',
			required: false,
		},
	},
	/**
   * @param {import("discord.js").Message} message
   */
	async execute(message, args, client) {
		const member = args[0]
			? message.mentions.members.first() || message.guild.members.cache.get(args[0])
			: message.member;

		if (!member) {
			return await message.channel.send('Member not found');
		}
		const commands = db.fetch(`commands_${message.guild.id}_${message.author.id}`) ?? 0;
		const messages = db.fetch(`messages_${message.guild.id}_${message.author.id}`) ?? 0;
		const roles = member.roles.cache.map(role => role.toString());
		let activity;
		if (!member.presence?.activities[0]) {
			activity = 'None';
		} else {
			activity = `${capitalizeFirstLetter(member.presence.activities[0].type.toLowerCase())} ${bold(`${member.presence.activities[0].name}`)}`;
		}
		let color = member.displayHexColor;
		if (color === '#000000') {color = '#C0C0C0';}

		const badges = member.id === client.user.id
			? ['<:VERIFIED_BOT:885673359474569226>']
			: Object.keys(allBadges).filter(b => member.user.flags.has(b)).map(b => allBadges[b]);

		if (member.id === message.guild.ownerId) {badges.push('<:serverowner:885673359885606942>');}
		const status = statuses[member.presence?.status ?? 'offline'];
		const embed = new MessageEmbed()
			.setTitle(`${member.displayName}`)
			.setColor(color)
			.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
			.addField('Username', member.user.tag)
			.addField('ID', member.id, true)
			.addField('Messages sent', inlineCode(messages.toString()), true)
			.addField('Commands ran:', inlineCode(commands.toString()), true)
			.addField('Account Created', member.user.createdAt.toDateString(), true)
			.addField('Joined Server', member.joinedAt.toDateString(), true)
			.addField('Current VC: ', member.voice.channel === null ? 'None' : `<:voice_channel:804772497684693052> ${member.voice.channel.name}`, true)
			.addField('Status: ', status, true)
			.addField('Activity: ', activity, true)
			.addField('Roles', roles.join(' **|** '), true)
			.addField('Badges: ', badges.join(' ') || 'None', true)
			.setFooter(`Powered by the ${message.client.user.username}`, member.user.displayAvatarURL({ dynamic: true }))
			.setTimestamp();
		return await message.reply({ embeds: [embed] });
	},
	/**
   * @param {import("discord.js").CommandInteraction} interaction
   * @param {import("discord.js").Client} client
   */
	async executeSlash(interaction, client) {
		/** @type {import("discord.js").User} */
		const user = (interaction.options.getUser('user') ?? interaction.user);
		const member = interaction.guild.members.resolve(user);
		if (!member) {
			return await interaction.reply('Member not found');
		}
		const commands = db.fetch(`commands_${interaction.guild.id}_${interaction.user.id}`) ?? 0;
		const messages = db.fetch(`messages_${interaction.guild.id}_${interaction.user.id}`) ?? 0;
		// Force fetch to get banner
		await user.fetch(true);

		const roles = member.roles.cache.map(role => role.toString());
		let activity;
		if (!member.presence?.activities[0]) {
			activity = 'None';
		} else {
			activity = `${capitalizeFirstLetter(member.presence.activities[0].type.toLowerCase())} ${bold(`${member.presence.activities[0].name}`)}`;
		}
		let color = member.displayHexColor;
		if (color === '#000000') {color = '#C0C0C0';}

		const badges = member.id === client.user.id
			? ['<:VERIFIED_BOT:885673359474569226>']
			: Object.keys(allBadges).filter(b => member.user.flags.has(b)).map(b => allBadges[b]);

		if (member.id === interaction.guild.ownerId) {badges.push('<:serverowner:885673359885606942>');}

		const status = statuses[member.presence?.status ?? 'offline'];
		const embed = new MessageEmbed()
			.setTitle(`${member.displayName}`)
			.setColor(color)
			.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
			.addField('Username', member.user.tag)
			.addField('ID', member.id, true)
			.addField('Messages sent', inlineCode(messages.toString()), true)
			.addField('Commands ran:', inlineCode(commands.toString()), true)
			.addField('Account Created', member.user.createdAt.toDateString(), true)
			.addField('Joined Server', member.joinedAt.toDateString(), true)
			.addField('Current VC: ', member.voice.channel === null ? 'None' : `<:voice_channel:804772497684693052> ${member.voice.channel.name}`, true)
			.addField('Status: ', status, true)
			.addField('Activity: ', activity, true)
			.addField('Roles', roles.join(` ${bold('|')} `), true)
			.addField('Badges: ', badges.join(' ') || 'None', true)
			.setFooter(`Powered by the ${interaction.client.user.username}`, member.user.displayAvatarURL({ dynamic: true }))
			.setTimestamp();
		return await interaction.reply({ embeds: [embed] });
	},
};

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}