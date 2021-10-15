const getColors = require('get-image-colors');
const { MessageEmbed } = require('discord.js');
const { drawCard, Gradient } = require('discord-welcome-card');
const db = require('quick.db');
const color = require('../color.json');
const Canvas = require('canvas');
const config = require('../config.json');
const { getLogChannel, getWelcomeChannel } = require('../utils.js');

Canvas.registerFont('./BalooTammudu2-Regular.ttf', { family: 'sans-serif' });
// registerFont('./OpenSans-Regular.ttf', { family: 'sans-serif' });
/** @type {(...args: import("discord.js").ClientEvents["guildMemberAdd"]) => Promise<any>} */
module.exports = async member => {
	getColors(member.user.displayAvatarURL({ format: 'png' })).then(async colors => {
		const welcomeChannelID = db.get('welcomechannel_' + member.guild.id);
		const welcomeChannel = member.guild.channels.cache.get(welcomeChannelID);
		const guild = member.guild;
		const { client } = member.guild;

		// Send the message to a designated channel on a server:
		if (!welcomeChannel) return;
		const statuses = {
			online: '#00ff5e',
			dnd: '#bf000d',
			idle: '#ff9d00',
			offline: '#454545',
		};
		const image = await drawCard({
			theme: 'circuit',
			text: {
				title: 'Hello',
				text: member.user.tag + ',',
				subtitle: `welcome to ${guild.name}!`,
				color: shadeColor(colors.map(color1 => color1.hex())[0].toString(), 75),
			},
			avatar: {
				image: member.user.displayAvatarURL({ format: 'png' }),
				outlineWidth: 5,
				outlineColor: new Gradient('linear',
					[0, shadeColor(statuses[member.presence?.status ?? 'offline'], -50)],
					[1, statuses[member.presence?.status ?? 'offline']],
				),
			},
			background: member.guild.bannerURL({ format: 'png' }) ?? 'https://i.imgur.com/ea9PB3H.png',
			blur: 1,
			border: true,
			rounded: true,
		});

		getWelcomeChannel(member.guild, db)?.send({ files: [{ name: 'welcome-card.png', attachment: image }] });
		if (!getLogChannel(member.guild, db)) return;

		const embed = new MessageEmbed()
			.setAuthor('Member joined', 'https://cdn.discordapp.com/emojis/812013459298058260.png')
			.setColor(color.bot_theme)
			.setDescription(`${member.user.tag} joined ${member.guild.name}`)
			.addField('Account Created:', `${member.user.createdAt.toDateString()}`, true)
			.setFooter(`${client.user.username} MEMBER LOGGING`)
			.setTimestamp();
		const logChannel = getLogChannel(member.guild, db);
		const webhooks = await logChannel.fetchWebhooks();
		const webhook = webhooks.find(wh => wh.owner.id === client.user.id);

		await webhook.send({
			username: `${client.user.username} Logging`,
			avatarURL: config.webhookAvatarURL,
			embeds: [embed],
		});
	});
};

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