const { MessageEmbed, MessageAttachment } = require('discord.js');
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

		const DIG = require('discord-image-generation');
		const text = message.cleanContent.slice(message.content.indexOf(args[0]), message.content.length);

		if (!text) {return await message.reply({ content: 'Please provide text for me to make a lisa presentation' });}

		if (text.length > 300) {return await message.reply({ content: 'I can only make a lisa presentation out of 300 characters' });}

		const img = await new DIG.LisaPresentation().getImage(text);
		const attach = new MessageAttachment(img, 'LisaPresentation.png');

		const imageEmbed = new MessageEmbed()
			.setTitle('Lisa Presentation')
			.setImage('attachment://LisaPresentation.png')
			.setColor(message.guild?.me.displayHexColor ?? '#FFB700')
			.setTimestamp()
			.setFooter({ text: `${message.client.user.username} Images`, iconURL: `${message.client.user.displayAvatarURL({ dynamic: true })}` });

		await message.reply({ embeds: [imageEmbed], files: [attach] });
	},
	async executeSlash(interaction) {
		const wait = require('util').promisify(setTimeout);
		await interaction.deferReply();
		await wait(1);

		const DIG = require('discord-image-generation');
		const text = interaction.options.getString('message');

		if (!text) {return await interaction.editReply({ content: 'Please provide text for me to make a lisa presentation' });}

		if (text.length > 300) {return await interaction.editReply({ content: 'I can only make a lisa presentation out of 300 characters' });}

		const img = await new DIG.LisaPresentation().getImage(text);
		const attach = new MessageAttachment(img, 'LisaPresentation.png');

		const imageEmbed = new MessageEmbed()
			.setTitle('Lisa Presentation')
			.setImage('attachment://LisaPresentation.png')
			.setColor(interaction.guild?.me.displayHexColor ?? '#FFB700')
			.setTimestamp()
			.setFooter({ text: `${interaction.client.user.username} Images`, iconURL: `${interaction.client.user.displayAvatarURL({ dynamic: true })}` });

		await interaction.editReply({ embeds: [imageEmbed], files: [attach] });
	},
};
