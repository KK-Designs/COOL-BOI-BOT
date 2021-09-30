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

		// Send the message to a designated channel on a server:
		/* const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome-and-goodbye');
	// Do nothing if the channel wasn't found on this server
	if (!channel) return;
	// Send the message, mentioning the member
	channel.send(`Hey ${member}, welcome to **${guild.name}!**`);*/
		// member.send(`Have a good time here in **${guild.name}**! Please make sure to read the rules before sending in #rules. If you have a problem with this server, Dm @ModMail#5460 for help. `);
		if (!welcomeChannel) {return;}
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

		/* const canvas = Canvas.createCanvas(700, 250);
		const ctx = canvas.getContext('2d');
		const background = await Canvas.loadImage('./cool-boi.png');
		// const background = await Canvas.loadImage('./wallpaper.jpg');

		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
		ctx.strokeStyle = '#74037b';
		ctx.strokeRect(0, 0, canvas.width, canvas.height);
		// Slightly smaller text placed above the member's display name
		ctx.font = applyText(canvas, member, 32);
		ctx.fillStyle = '#ffffff';
		ctx.fillText(`Hey ${member.user.username},`, canvas.width / 2.5, canvas.height / 3.5);
		ctx.font = '34px sans-serif';
		ctx.fillStyle = '#ffffff';
		ctx.fillText('welcome to the', canvas.width / 2.5, canvas.height / 2.2);
		// Add an exclamation point here and below
		ctx.font = applyText(canvas, guild.name, 48);
		ctx.fillStyle = '#ffffff';
		ctx.fillText(`${guild.name}!`, canvas.width / 2.5, canvas.height / 1.3);
		ctx.beginPath();
		ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();
		const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));

		ctx.drawImage(avatar, 25, 25, 200, 200);
		const welattachment = new MessageAttachment(canvas.toBuffer(), 'welcome-image.png');*/

		getWelcomeChannel(member.guild, db)?.send({ files: [{ name: 'welcome-card.png', attachment: image }] });
		if (!getLogChannel(member.guild, db)) {return;}

		const embed = new MessageEmbed()
			.setAuthor('Member joined', 'https://cdn.discordapp.com/emojis/812013459298058260.png')
			.setColor(color.bot_theme)
			.setDescription(`${member.user.tag} joined ${member.guild.name}`)
			.addField('Account Created:', `${member.user.createdAt.toDateString()}`, true)
			.setFooter('COOL BOI BOT MEMBER LOGGING')
			.setTimestamp();
		const logChannel = getLogChannel(member.guild, db);
		const webhooks = await logChannel.fetchWebhooks();
		const webhook = webhooks.first();

		await webhook.send({
			username: 'COOL BOI BOT Logging',
			avatarURL: config.webhookAvatarURL,
			embeds: [embed],
		});
	});
};
/* function applyText(canvas, text, fontSize = 70) {
	const ctx = canvas.getContext('2d');

	ctx.font = `${fontSize -= 10}px sans-serif`;
	// Compare pixel width of the text to the canvas minus the approximate text size
	while (ctx.measureText(text).width > canvas.width - 300) {
		// Assign the font to the context and decrement it so it can be measured again
		ctx.font = `${fontSize -= 10}px sans-serif`;
	}

	return ctx.font;
}*/
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