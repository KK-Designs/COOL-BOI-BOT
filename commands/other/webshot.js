const { MessageAttachment, MessageEmbed } = require('discord.js');
const webshot = require('capture-website');
const sendError = require('../../error.js');
const color = require('../../color.json');
const regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
module.exports = {
	name: 'webshot',
	description: 'Gets the screen shot of the specified URL 🔗',
	cooldown: 3,
	usage: '[url]',
	category: 'other',
	options: {
		url: {
			type: 'String',
			description: 'The url to screenshot',
		},
	},
	async execute(message, args) {
		if (!args.length) {return sendError('Put a url for me to get a screenshot', message.channel);}

		if (!args[0].match(regex)) {return sendError('Please provide a valid URL. Something like `https://google.com`', message.channel);}

		const attachment = new MessageAttachment(await webshot.buffer(args[0], 'screenshot.png'), 'screenshot.png');
		const embed = new MessageEmbed()
			.setTitle(`Web shot for ${extractHostname(args[0])}`)
			.setURL(args[0])
			.setImage(`attachment://${attachment.name}`)
			.setAuthor({ name: `${extractHostname(args[0])}`, iconURL: `https://external-content.duckduckgo.com/ip3/${extractHostname(args[0])}.ico` })
			.setColor(message.guild?.me.displayHexColor ?? color.discord)
			.setFooter({ text: `Powered by the ${message.client.user.username}`, iconURL: message.client.user.displayAvatarURL({ dynamic: true }) });

		await message.reply({ embeds: [embed], files: [attachment] });
	},
	async executeSlash(interaction) {
		const url = interaction.options.getString('url', true);
		if (!url.match(regex)) {return await interaction.reply('Please provide a valid URL. Something like `https://google.com`');}
		await interaction.deferReply();

		const attachment = new MessageAttachment(await webshot.buffer(url, 'screenshot.png'), 'screenshot.png');
		const embed = new MessageEmbed()
			.setTitle(`Web shot for ${extractHostname(url)}`)
			.setURL(url)
			.setImage(`attachment://${attachment.name}`)
			.setAuthor({ name: `${extractHostname(url)}`, iconURL: `https://external-content.duckduckgo.com/ip3/${extractHostname(url)}.ico` })
			.setColor(interaction.guild?.me.displayHexColor ?? color.discord)
			.setFooter({ text: `Powered by the ${interaction.client.user.username}`, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) });

		await interaction.editReply({ embeds: [embed], files: [attachment] });
	},
};

function extractHostname(url) {
	let hostname;
	// find & remove protocol (http, ftp, etc.) and get hostname

	if (url.indexOf('//') > -1) {
		hostname = url.split('/')[2];
	} else {
		hostname = url.split('/')[0];
	}

	// find & remove port number
	hostname = hostname.split(':')[0];
	// find & remove "?"
	hostname = hostname.split('?')[0];

	return hostname;
}
