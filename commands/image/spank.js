const { MessageEmbed, MessageAttachment } = require('discord.js');
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

		const DIG = require('discord-image-generation');
		const user = message.mentions.users.first();

		if (!user) {return await message.reply({ content: 'You need to mention someone to spank unless your too nice' });}

		if (user.id === message.author.id) {return await message.reply({ content: 'You can\'t spank yourself you idiot' });}

		const img = await new DIG.Spank().getImage(message.author.displayAvatarURL({ format: 'png' }), user.displayAvatarURL({ format: 'png' }));
		const attach = new MessageAttachment(img, 'spank.png');

		const imageEmbed = new MessageEmbed()
			.setTitle('Spank')
			.setImage('attachment://spank.png')
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
		const user = interaction.options.getUser('user');

		if (!user) {return await interaction.editReply({ content: 'You need to mention someone to spank unless your too nice' });}

		if (user.id === interaction.user.id) {return await interaction.editReply({ content: 'You can\'t spank yourself you idiot' });}

		const img = await new DIG.Spank().getImage(interaction.user.displayAvatarURL({ format: 'png' }), user.displayAvatarURL({ format: 'png' }));
		const attach = new MessageAttachment(img, 'spank.png');

		const imageEmbed = new MessageEmbed()
			.setTitle('Spank')
			.setImage('attachment://spank.png')
			.setColor(interaction.guild?.me.displayHexColor ?? '#FFB700')
			.setTimestamp()
			.setFooter({ text: `${interaction.client.user.username} Images`, iconURL: `${interaction.client.user.displayAvatarURL({ dynamic: true })}` });

		await interaction.editReply({ embeds: [imageEmbed], files: [attach] });
	},
};
