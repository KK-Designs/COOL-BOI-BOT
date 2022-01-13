const { MessageEmbed, MessageAttachment } = require('discord.js');
module.exports = {
	name: 'beautiful',
	description: 'Self-praise yourself but if you hate yourself that much then do it to a friend',
	usage: '(user)',
	cooldown: 3,
	category: 'image',
	clientPermissons: ['EMBED_LINKS', 'ATTACH_FILES'],
	options: {
		user: {
			type: 'User',
			description: 'The user to beautify',
			required: false,
		},
	},
	async execute(message) {
		const DIG = require('discord-image-generation');
		const user = message.mentions.users.first() || message.author;
		const img = await new DIG.Beautiful().getImage(user.displayAvatarURL({ format: 'png' }));
		const attach = new MessageAttachment(img, 'beautiful.png');
		const imageEmbed = new MessageEmbed()
			.setTitle('Beautiful')
			.setImage('attachment://beautiful.png')
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
		const user = interaction.options.getUser('user') || interaction.user;
		const img = await new DIG.Beautiful().getImage(user.displayAvatarURL({ format: 'png' }));
		const attach = new MessageAttachment(img, 'beautiful.png');
		const imageEmbed = new MessageEmbed()
			.setTitle('Beautiful')
			.setImage('attachment://beautiful.png')
			.setColor(interaction.guild?.me.displayHexColor ?? '#FFB700')
			.setTimestamp()
			.setFooter({ text: `${interaction.client.user.username} Images`, iconURL: `${interaction.client.user.displayAvatarURL({ dynamic: true })}` });

		await interaction.editReply({ embeds: [imageEmbed], files: [attach] });
	},
};
