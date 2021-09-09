module.exports = {
	name: 'level2',
	description: 'Gets your server rank card',
	cooldown: 2,
	category: 'general',
	async execute(message) {

		const Discord = require('discord.js');
		const db = require('quick.db');
		let messagefetch = db.fetch(`messages_${message.guild.id}_${message.author.id}`);
		let levelfetch = db.fetch(`level_${message.guild.id}_${message.author.id}`);

		if (messagefetch == null) messagefetch = '0';
		if (levelfetch == null) levelfetch = '0';

		const Canvas = require('canvas');
		const { registerFont } = require('canvas');

		registerFont('./OpenSans-Regular.ttf', { family: 'sans-serif' });

		const canvas = Canvas.createCanvas(700, 250);
		const ctx = canvas.getContext('2d');

		const background = await Canvas.loadImage('./cool-boi.png');
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

		ctx.strokeStyle = '#74037b';
		ctx.strokeRect(0, 0, canvas.width, canvas.height);

		ctx.font = '40px sans-serif';
		ctx.fillStyle = '#000133';
		ctx.fillText(`Level: ${levelfetch}  Messages: ${messagefetch}`, canvas.width / 2.8, canvas.height / 3.0);

		// Add an exclamation point here and below
		ctx.font = '48px sans-serif';
		ctx.fillStyle = '#000133';
		ctx.fillText(`${message.author.tag}`, canvas.width / 2.8, canvas.height / 1.5);

		ctx.beginPath();
		ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();

		const avatar = await Canvas.loadImage(message.author.displayAvatarURL({ format: 'png' }));
		ctx.drawImage(avatar, 25, 25, 200, 200);
		const gradient = await Canvas.loadImage('./gradient.png');
		ctx.drawImage(gradient, 256, 256, 256, 256);

		const welattachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

		message.channel.send({ files: [ welattachment ] });

	},
};