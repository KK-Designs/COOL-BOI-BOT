module.exports = {
	name: 'spank',
	description: 'Spank your friends!',
	usage: '[user]',
	cooldown: 3,
	category: 'image',
	clientPermissons: ['EMBED_LINKS', 'ATTACH_FILES'],
	options: {
		user: {
			type: 'User',
			description: 'The user to spank',
		},
	},
	async execute(message) {
		const Discord = require('discord.js');
		const DIG = require('discord-image-generation');
		const user = message.mentions.users.first();

		if (!user) {return await message.reply({ content: 'You need to mention someone to spank unless your too nice' });}

		if (user.id === message.author.id) {return await message.reply({ content: 'You can\'t spank yourself you idiot' });}

		const img = await new DIG.Spank().getImage(message.author.displayAvatarURL({ format: 'png' }), user.displayAvatarURL({ format: 'png' }));
		const attach = new Discord.MessageAttachment(img, 'spank.png');
		const { MessageEmbed } = require('discord.js');
		const imageEmbed = new MessageEmbed()
			.setTitle('Spank')
			.setImage('attachment://spank.png')
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
		const user = interaction.options.getUser('user');

		if (!user) {return await interaction.editReply({ content: 'You need to mention someone to spank unless your too nice' });}

		if (user.id === interaction.member.user.id) {return await interaction.editReply({ content: 'You can\'t spank yourself you idiot' });}

		const img = await new DIG.Spank().getImage(interaction.member.user.displayAvatarURL({ format: 'png' }), user.displayAvatarURL({ format: 'png' }));
		const attach = new Discord.MessageAttachment(img, 'spank.png');
		const { MessageEmbed } = require('discord.js');
		const imageEmbed = new MessageEmbed()
			.setTitle('Spank')
			.setImage('attachment://spank.png')
			.setColor(interaction.guild?.me.displayHexColor ?? '#FFB700')
			.setTimestamp()
			.setFooter(`${interaction.client.user.username} Images`, `${interaction.client.user.displayAvatarURL({ dynamic: true })}`);

		interaction.editReply({ embeds: [imageEmbed], files: [attach] });
	},
};