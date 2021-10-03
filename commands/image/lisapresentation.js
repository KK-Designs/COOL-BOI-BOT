module.exports = {
	name: 'lisapresentation',
	description: 'Create your own lisa presentation',
	usage: '[text]',
	aliases: ['present', 'lisa'],
	cooldown: 3,
	category: 'image',
	clientPermissons: ['EMBED_LINKS', 'ATTACH_FILES'],
	options: {
		message: {
			type: 'String',
			description: 'The text to lisa present',
		},
	},
	async execute(message, args) {
		const Discord = require('discord.js');
		const DIG = require('discord-image-generation');
		const text = args.join(' ');

		if (!text) {return await message.reply({ content: 'Please provide text for me to make a lisa presentation' });}

		if (text.length > 300) {return await message.reply({ content: 'I can only make a lisa presentation out of 300 characters' });}

		const img = await new DIG.LisaPresentation().getImage(text);
		const attach = new Discord.MessageAttachment(img, 'LisaPresentation.png');
		const { MessageEmbed } = require('discord.js');
		const imageEmbed = new MessageEmbed()
			.setTitle('Lisa Presentation')
			.setImage('attachment://LisaPresentation.png')
			.setColor(message.guild?.me.displayHexColor ?? '#FFB700')
			.setTimestamp()
			.setFooter(`${message.client.user.username} Images`, `${message.client.user.displayAvatarURL({ dynamic: true })}`);

		message.channel.send({ embeds: [imageEmbed], files: [attach] });
	},
	async executeSlash(interaction) {
		const wait = require('util').promisify(setTimeout);
		await interaction.deferReply();
		await wait('1000');
		const Discord = require('discord.js');
		const DIG = require('discord-image-generation');
		const text = interaction.options.getString('message');

		if (!text) {return await interaction.editReply({ content: 'Please provide text for me to make a lisa presentation' });}

		if (text.length > 300) {return await interaction.editReply({ content: 'I can only make a lisa presentation out of 300 characters' });}

		const img = await new DIG.LisaPresentation().getImage(text);
		const attach = new Discord.MessageAttachment(img, 'LisaPresentation.png');
		const { MessageEmbed } = require('discord.js');
		const imageEmbed = new MessageEmbed()
			.setTitle('Lisa Presentation')
			.setImage('attachment://LisaPresentation.png')
			.setColor(interaction.guild?.me.displayHexColor ?? '#FFB700')
			.setTimestamp()
			.setFooter(`${interaction.client.user.username} Images`, `${interaction.client.user.displayAvatarURL({ dynamic: true })}`);

		interaction.editReply({ embeds: [imageEmbed], files: [attach] });
	},
};