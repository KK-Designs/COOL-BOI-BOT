const color = require('../../color.json');
const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'embed',
	description: 'Gets your custom message embed!',
	usage: '[title] (description) (footer)',
	cooldown: 3,
	category: 'other',
	clientPermissons: 'EMBED_LINKS',
	options: {
		title: {
			type: 'String',
			description: 'The title of the embed',
		},
		description: {
			type: 'String',
			description: 'The description of the embed',
			required: false,
		},
		footer: {
			type: 'String',
			description: 'The footer of the embed',
			required: false,
		},
	},
	async execute(message, args) {

		const customargs = args.join(' ').split('|');

		if (!args[0]) {
			return await message.reply({
				content: 'You must provide a title. Feilds are seperated by `|` Like this: `/embed Test embed | embed description | embed footer` ',
			});
		}
		const customEmbed = new MessageEmbed()
			.setColor(color.discord)
			.setTitle(customargs[0])
			.setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
			.setDescription(!customargs[1] ? '\u200B' : customargs[1])
			.setFooter({ text: !customargs[2] ? '\u200B' : customargs[2] });

		await message.reply({ embeds: [customEmbed] });
	},
	async executeSlash(interaction) {
		const title = interaction.options.getString('title', true);
		const description = interaction.options.getString('description') ?? '\u200b';
		const footer = interaction.options.getString('footer') ?? '\u200b';

		const customEmbed = new MessageEmbed()
			.setColor(color.discord)
			.setTitle(title)
			.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
			.setDescription(description)
			.setFooter({ text: footer });

		await interaction.reply({ embeds: [customEmbed] });
	},
};
