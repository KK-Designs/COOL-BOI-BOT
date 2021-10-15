const { MessageEmbed, MessageAttachment } = require('discord.js');
module.exports = {
	name: 'deletefile',
	description: 'Delete the trash people you don\'t want',
	aliases: ['delete-user', 'no-more'],
	usage: '(user)',
	cooldown: 3,
	category: 'image',
	clientPermissons: ['EMBED_LINKS', 'ATTACH_FILES'],
	options: {
		user: {
			type: 'User',
			description: 'The user to put in the recycle bin.',
			required: false,
		},
	},
	async execute(message) {

		const DIG = require('discord-image-generation');
		const user = message.mentions.users.first() || message.author;
		const img = await new DIG.Delete().getImage(user.displayAvatarURL({ format: 'png' }));
		const attach = new MessageAttachment(img, 'delete.png');

		const imageEmbed = new MessageEmbed()
			.setTitle('Delete ' + user.tag)
			.setImage('attachment://delete.png')
			.setColor(message.guild?.me.displayHexColor ?? '#FFB700')
			.setTimestamp()
			.setFooter(`${message.client.user.username} Images`, `${message.client.user.displayAvatarURL({ dynamic: true })}`);

		message.channel.send({ embeds: [imageEmbed], files: [attach] });
	},
	async executeSlash(interaction) {
		const wait = require('util').promisify(setTimeout);
		await interaction.deferReply();
		await wait(1);

		const DIG = require('discord-image-generation');
		const user = interaction.options.getUser('user') || interaction.user;
		const img = await new DIG.Delete().getImage(user.displayAvatarURL({ format: 'png' }));
		const attach = new MessageAttachment(img, 'delete.png');

		const imageEmbed = new MessageEmbed()
			.setTitle('Delete ' + user.tag)
			.setImage('attachment://delete.png')
			.setColor(interaction.guild?.me.displayHexColor ?? '#FFB700')
			.setTimestamp()
			.setFooter(`${interaction.client.user.username} Images`, `${interaction.client.user.displayAvatarURL({ dynamic: true })}`);

		interaction.editReply({ embeds: [imageEmbed], files: [attach] });
	},
};