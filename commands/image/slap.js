const { MessageEmbed, MessageAttachment } = require('discord.js');
module.exports = {
	name: 'slap',
	description: 'Slap your friends!',
	usage: '[user]',
	cooldown: 3,
	category: 'image',
	clientPermissons: ['EMBED_LINKS', 'ATTACH_FILES'],
	options: {
		user: {
			type: 'User',
			description: 'The user to slap',
		},
	},
	async execute(message) {

		const DIG = require('discord-image-generation');
		const user = message.mentions.users.first();

		if (!user) {return await message.reply({ content: 'You need to mention someone to slap them unless your too nice' });}

		if (user.id === message.author.id) {return await message.reply({ content: 'You can\'t slap yourself you idiot. Wait a minute... 🤔' });}

		const img = await new DIG.Batslap().getImage(message.author.displayAvatarURL({ format: 'png' }), user.displayAvatarURL({ format: 'png' }));
		const attach = new MessageAttachment(img, 'slap.png');

		const imageEmbed = new MessageEmbed()
			.setTitle('Slap')
			.setImage('attachment://slap.png')
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

		if (user.id === interaction.user.id) {return await interaction.editReply({ content: 'You can\'t slap yourself you idiot. Wait a minute... 🤔' });}

		const img = await new DIG.Batslap().getImage(interaction.user.displayAvatarURL({ format: 'png' }), user.displayAvatarURL({ format: 'png' }));
		const attach = new MessageAttachment(img, 'slap.png');

		const imageEmbed = new MessageEmbed()
			.setTitle('Slap')
			.setImage('attachment://slap.png')
			.setColor(interaction.guild?.me.displayHexColor ?? '#FFB700')
			.setTimestamp()
			.setFooter({ text: `${interaction.client.user.username} Images`, iconURL: `${interaction.client.user.displayAvatarURL({ dynamic: true })}` });

		await interaction.editReply({ embeds: [imageEmbed], files: [attach] });
	},
};
