module.exports = {
	name: 'level',
	description: 'Gets your server rank card',
	cooldown: 3,
	category: 'levels',
	guildOnly: true,
	usage: '(@user or id)',
	aliases: ['rank'],
	clientPermissons: 'ATTACH_FILES',
	async execute(message, args) {
		let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		if (!args[0]) {
			member = message.member || message.author;
		}
		else if (member.user.bot) {return message.channel.send({ content: 'I don\'t track bots activity', reply: { messageReference: message.id } });}
		const Discord = require('discord.js');
		const db = require('quick.db');
		const { progressBar } = require('canvas-extras');
		let messagefetch = db.fetch(`messages_${message.guild.id}_${member.user.id}`);
		let levelfetch = db.fetch(`level_${message.guild.id}_${member.user.id}`);

		if (messagefetch == null) messagefetch = '0';
		if (levelfetch == null) levelfetch = '0';

		let status;
		if (!member.presence) {
			status = '#454545';
		}
		else if (member.presence.status === 'online') {
			status = '#00ff5e';
		}
		else if (member.presence.status === 'dnd') {
			status = '#bf000d';
		}
		else if (member.presence.status === 'idle') {
			status = '#ff9d00';
		}

		const Canvas = require('canvas');
		const { registerFont } = require('canvas');

		registerFont('./BalooTammudu2-Regular.ttf', { family: 'sans-serif' });

		const applyText = (canvas, text) => {
			const ctx = canvas.getContext('2d');

			// Declare a base size of the font
			let fontSize = 50;

			do {
				// Assign the font to the context and decrement it so it can be measured again
				ctx.font = `${fontSize -= 2}px sans-serif`;
				// Compare pixel width of the text to the canvas minus the approximate avatar size
			} while (ctx.measureText(text).width > canvas.width - 300);

			// Return the result to use in the actual canvas
			return ctx.font;
		};

		const canvas = Canvas.createCanvas(700, 250);
		const ctx = canvas.getContext('2d');
		const totalmessages = 25 + 25 * levelfetch + Math.floor(levelfetch / 3) * 25;


		const background = await Canvas.loadImage('./cool-boi.png');
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

		ctx.beginPath();
		ctx.progressBar(messagefetch, totalmessages, 269, 192, 400, 25, '#000387');
		ctx.closePath();

		ctx.strokeStyle = '#74037b';
		ctx.strokeRect(0, 0, canvas.width, canvas.height);

		ctx.font = '38px sans-serif';
		ctx.fillStyle = '#000133';
		ctx.fillText(`${levelfetch}                            ${messagefetch}`, canvas.width / 1.9, canvas.height / 3.6);

		ctx.font = '30px sans-serif';
		ctx.fillStyle = '#13185c';
		ctx.fillText(' LEVEL                 MESSAGES', canvas.width / 2.6, canvas.height / 3.6);

		// Add an exclamation point here and below
		// ctx.font = '48px sans-serif';
		ctx.font = applyText(canvas, member.user.username);
		ctx.fillStyle = '#000133';
		ctx.fillText(`${member.user.username}`, 355, canvas.height / 1.9);

		ctx.font = '32px sans-serif';
		ctx.fillStyle = '#13185c';
		ctx.fillText(`          #${member.user.discriminator}`, canvas.width / 2.0, canvas.height / 1.4);

		ctx.beginPath();
		ctx.strokeStyle = '#000133';
		ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.stroke();
		ctx.lineWidth = 7;
		ctx.clip();

		// Fill with gradient
		ctx.strokeStyle = status;
		ctx.beginPath();
		ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
		ctx.stroke();
		ctx.lineWidth = 99;
		ctx.shadowBlur = 15;
		ctx.shadowColor = '#000133';
		// ctx.fill();

		const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'png' }));
		ctx.drawImage(avatar, 25, 25, 200, 200);
		const gradient = await Canvas.loadImage('./gradient.png');
		ctx.drawImage(gradient, 256, 256, 256, 256);

		const rankAttachment = new Discord.MessageAttachment(canvas.toBuffer(), 'rank-card.png');

		message.reply({ files: [ rankAttachment ] });

	},
};