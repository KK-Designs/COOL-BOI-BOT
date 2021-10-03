module.exports = {
	name: 'wanted',
	description: 'Get a wanted image from the specified users avatar',
	usage: '(user)',
	cooldown: 3,
	category: 'image',
	clientPermissons: ['EMBED_LINKS', 'ATTACH_FILES'],
	options: {
		user: {
			type: 'User',
			description: 'The user to generate a wanted poster',
			required: false,
		},
	},
	async execute(message) {
		const Discord = require('discord.js');
		const DIG = require('discord-image-generation');
		const user = message.mentions.users.first() || message.author;
		const img = await new DIG.Wanted().getImage(user.displayAvatarURL({ format: 'png' }), '$');
		const attach = new Discord.MessageAttachment(img, 'wanted.png');
		const { MessageEmbed } = require('discord.js');
		const imageEmbed = new MessageEmbed()
			.setTitle('Wanted')
			.setImage('attachment://wanted.png')
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
		const user = interaction.options.getUser('user') || interaction.member.user;
		const img = await new DIG.Wanted().getImage(user.displayAvatarURL({ format: 'png' }), '$');
		const attach = new Discord.MessageAttachment(img, 'wanted.png');
		const { MessageEmbed } = require('discord.js');
		const imageEmbed = new MessageEmbed()
			.setTitle('Wanted')
			.setImage('attachment://wanted.png')
			.setColor(interaction.guild?.me.displayHexColor ?? '#FFB700')
			.setTimestamp()
			.setFooter(`${interaction.client.user.username} Images`, `${interaction.client.user.displayAvatarURL({ dynamic: true })}`);

		interaction.editReply({ embeds: [imageEmbed], files: [attach] });
	},
};