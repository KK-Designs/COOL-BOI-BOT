// @ts-nocheck
const { MessageAttachment } = require('discord.js');
const db = require('quick.db');
const yuricanvas = require('yuri-canvas');
const getColors = require('get-image-colors');
/**
 * @param {import("discord.js").GuildMember} member
 */
module.exports = {
	name: 'level',
	description: 'Gets your server rank card',
	cooldown: 3,
	category: 'levels',
	guildOnly: true,
	usage: '(@user or id)',
	aliases: ['rank'],
	clientPermissons: 'ATTACH_FILES',
	options: {
		user: {
			type: 'User',
			description: 'The user to check the levels of',
			required: false,
		},
	},
	/**
	 * @param {{ mentions: { members: { first: () => any; }; }; guild: { members: { cache: { get: (arg0: any) => any; }; }; id: any; bannerURL: (arg0: { format: string; }) => any; }; member: any; reply: (arg0: { content?: string; files?: Discord.MessageAttachment[]; }) => any; }} message
	 * @param {any[]} args
	 */
	async execute(message, args) {
		const member = args[0]
			? message.mentions.members.first() ?? message.guild.members.cache.get(args[0])
			: message.member;

		if (member.user.bot) {return await message.reply({ content: 'I don\'t track bots activity' });}
		getColors(member.user.displayAvatarURL({ format: 'png' })).then(async colors => {
			const levelfetch = await db.fetch(`level_${message.guild.id}_${member.user.id}`) ?? 1;
			const totalmessages = 25 + 25 * levelfetch + Math.floor(levelfetch / 3) * 25;
			const messagefetch = await db.fetch(`messages_${member.guild.id}_${member.user.id}`) ?? 1;
			const image = await yuricanvas.rank({
				username: member.user.username,
				discrim: member.user.discriminator,
				status: member.presence?.status ?? 'offline',
				level: levelfetch,
				neededXP: totalmessages,
				currentXP: messagefetch,
				avatarURL: member.user.displayAvatarURL({ format: 'png' }),
				color: shadeColor(colors.map(color1 => color1.hex())[0].toString(), 50),
				background: message.guild.bannerURL({ format: 'png' }) ?? undefined,
			});
			const attachment = new MessageAttachment(image, 'rank.png');
			await message.reply({ files: [ attachment ] });
		});
	},
	/**
	 * @param {{ deferReply: () => any; options: { getMember: (arg0: string) => any; }; member: any; reply: (arg0: { content: string; }) => any; guild: { id: any; bannerURL: (arg0: { format: string; }) => any; }; editReply: (arg0: { files: Discord.MessageAttachment[]; }) => any; }} interaction
	 */
	async executeSlash(interaction) {
		await interaction.deferReply();
		const member = interaction.options.getMember('user') ?? interaction.member;

		if (member.user.bot) {return await interaction.editReply({ content: 'I don\'t track bots activity' });}

		getColors(member.user.displayAvatarURL({ format: 'png' })).then(async colors => {
			const levelfetch = await db.fetch(`level_${interaction.guild.id}_${member.user.id}`) ?? 1;
			const totalmessages = 50 + 50 * (levelfetch - 1) + Math.floor((levelfetch - 1) / 3) * 25;
			const messagesNeeded = db.fetch(`messagesneeded_${member.guild.id}_${member.user.id}`) ?? 1;
			console.log(messagesNeeded);
			const image = await yuricanvas.rank({
				username: member.user.username,
				discrim: member.user.discriminator,
				status: member.presence?.status ?? 'offline',
				level: levelfetch,
				neededXP: totalmessages,
				currentXP: messagesNeeded,
				avatarURL: member.user.displayAvatarURL({ format: 'png' }),
				color: shadeColor(colors.map(color1 => color1.hex())[0].toString(), 50),
				background: interaction.guild.bannerURL({ format: 'png' }) ?? undefined,
			});
			const attachment = new MessageAttachment(image, 'rank.png');
			await interaction.editReply({ files: [ attachment ] });
		});
	},
};

/**
 * @param {string} color1
 * @param {number} percent
 */
function shadeColor(color1, percent) {
	let R = parseInt(color1.substring(1, 3), 16);
	let G = parseInt(color1.substring(3, 5), 16);
	let B = parseInt(color1.substring(5, 7), 16);
	R = parseInt(R * (100 + percent) / 100);
	G = parseInt(G * (100 + percent) / 100);
	B = parseInt(B * (100 + percent) / 100);
	R = (R < 255) ? R : 255;
	G = (G < 255) ? G : 255;
	B = (B < 255) ? B : 255;
	const RR = ((R.toString(16).length == 1) ? '0' + R.toString(16) : R.toString(16));
	const GG = ((G.toString(16).length == 1) ? '0' + G.toString(16) : G.toString(16));
	const BB = ((B.toString(16).length == 1) ? '0' + B.toString(16) : B.toString(16));
	return '#' + RR + GG + BB;
}
