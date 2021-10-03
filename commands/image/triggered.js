module.exports = {
	name: 'triggered',
	description: 'Get a triggered image from the specified users avatar',
	cooldown: 3,
	usage: '(user)',
	category: 'image',
	clientPermissons: ['EMBED_LINKS', 'ATTACH_FILES'],
	options: {
		user: {
			type: 'User',
			description: 'The user to get a triggered gif',
			required: false,
		},
	},
	async execute(message) {
		const Discord = require('discord.js');
		const DIG = require('discord-image-generation');
		const user = message.mentions.users.first() || message.author;
		const img = await new DIG.Triggered().getImage(user.displayAvatarURL({ format: 'png' }));
		const attach = new Discord.MessageAttachment(img, 'triggered.gif');
		const { MessageEmbed } = require('discord.js');
		const imageEmbed = new MessageEmbed()
			.setTitle('Triggered')
			.setImage('attachment://triggered.gif')
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
		const img = await new DIG.Triggered().getImage(user.displayAvatarURL({ format: 'png' }));
		const attach = new Discord.MessageAttachment(img, 'triggered.gif');
		const { MessageEmbed } = require('discord.js');
		const imageEmbed = new MessageEmbed()
			.setTitle('Triggered')
			.setImage('attachment://triggered.gif')
			.setColor(interaction.guild?.me.displayHexColor ?? '#FFB700')
			.setTimestamp()
			.setFooter(`${interaction.client.user.username} Images`, `${interaction.client.user.displayAvatarURL({ dynamic: true })}`);

		interaction.editReply({ embeds: [imageEmbed], files: [attach] });
	},
};