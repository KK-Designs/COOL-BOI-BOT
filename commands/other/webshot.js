module.exports = {
	name: 'webshot',
	description: 'Gets the screen shot of the specified URL 🔗',
	cooldown: 3,
	usage: '[url]',
	category: 'other',
	async execute(message, args, client) {
		const user = message.author;
		const fs = require('fs');
		const { MessageAttachment, MessageEmbed } = require('discord.js');
		const printscreen = require('printscreen');
		const sendError = require('../../error.js');
		const color = require('../../color.json');
		const expression =
			/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
		const regex = new RegExp(expression);
		let filepath;

		if (!args.length) {return sendError('Put a url for me to get a screenshot', message.channel);}

		if (!args[0].match(regex)) {
			return sendError(
				'Please provide a valid URL. Something like `https://google.com`',
				message.channel,
			);
		}

		const buffer = await printscreen(
			'http://google.com',
			{
				viewport: {
					width: 1650,
					height: 1060,
				},
			},
			(err, data) => {
				filepath = data.file;
			},
		);

		console.log(filepath);

		const attach = new MessageAttachment(buffer, filepath.toString());

		const embed = new MessageEmbed()
			.setTitle(`Web shot for ${args[0]}`)
			.setImage('attachment://webshot.png')
			.setAuthor(user.username)
			.setColor(
				message.channel.type === 'dm'
					? color.discord
					: message.guild.me.displayHexColor,
			)
			.setFooter(user.username, user.displayAvatarURL({ dynamic: true }));
		message.channel.send({
			embeds: [embed],
			files: [attach],
			reply: { messageReference: message.id },
		});
	},
};
