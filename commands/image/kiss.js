const { MessageEmbed, MessageAttachment } = require('discord.js');
module.exports = {
	name: 'kiss',
	description: 'Kiss your friend! Or yourself',
	usage: '[user]',
	cooldown: 3,
	category: 'image',
	clientPermissons: ['EMBED_LINKS', 'ATTACH_FILES'],
	options: {
		user: {
			type: 'User',
			description: 'The user to kiss',
		},
	},
	async execute(message) {

		const DIG = require('discord-image-generation');
		const user = message.mentions.users.first();

		if (!user) {return await message.reply({ content: 'You need to mention someone to kiss them unless your already engaged' });}

		if (user.id === message.author.id) {return await message.reply({ content: 'You can\'t kiss yourself you idiot. Wait a minute... 🤔' });}

		const img = await new DIG.Kiss().getImage(message.author.displayAvatarURL({ format: 'png' }), user.displayAvatarURL({ format: 'png' }));
		const attach = new MessageAttachment(img, 'kiss.png');

		const imageEmbed = new MessageEmbed()
			.setTitle('Kiss ❤️‍🔥')
			.setImage('attachment://kiss.png')
			.setColor(message.guild?.me.displayHexColor ?? '#FFB700')
			.setTimestamp()
			.setFooter(`${message.client.user.username} Images`, `${message.client.user.displayAvatarURL({ dynamic: true })}`);

		await message.reply({ embeds: [imageEmbed], files: [attach] });
	},
	async executeSlash(interaction) {
		const wait = require('util').promisify(setTimeout);
		await interaction.deferReply();
		await wait(1);

		const DIG = require('discord-image-generation');
		const user = interaction.options.getUser('user');

		if (!user) {return await interaction.editReply({ content: 'You need to mention someone to kiss them unless' });}

		if (user.id === interaction.user.id) {return await interaction.editReply({ content: 'You can\'t kiss yourself you idiot. Wait a minute... 🤔' });}

		const img = await new DIG.Kiss().getImage(interaction.user.displayAvatarURL({ format: 'png' }), user.displayAvatarURL({ format: 'png' }));
		const attach = new MessageAttachment(img, 'kiss.png');

		const imageEmbed = new MessageEmbed()
			.setTitle('Kiss ❤️‍🔥')
			.setImage('attachment://kiss.png')
			.setColor(interaction.guild?.me.displayHexColor ?? '#FFB700')
			.setTimestamp()
			.setFooter(`${interaction.client.user.username} Images`, `${interaction.client.user.displayAvatarURL({ dynamic: true })}`);

		await interaction.editReply({ embeds: [imageEmbed], files: [attach] });
	},
};