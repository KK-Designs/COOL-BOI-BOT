const yuricanvas = require('yuri-canvas');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const randHexColor = () => '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;
module.exports = {
	name: 'color',
	description: 'Sends a random or specified color!',
	cooldown: 5,
	category: 'fun',
	options: {
		color: {
			type: 'String',
			description: 'The color to display (in hexadecimal form)',
			required: false,
		},
	},
	async execute(message, args, client) {
		const reqColor = args[0]?.toUpperCase() || randHexColor();
		if (!hexRegex.test(args[0])) {
			return await message.reply('The color must be in hexadecimal form. Try using `#FF0000`.');
		}

		const color = await yuricanvas.color(reqColor);
		const attachment = new MessageAttachment(color, 'color.png');
		const embed = new MessageEmbed()
			.setTitle(reqColor)
			.setColor(reqColor)
			.setImage('attachment://color.png')
			.setFooter(`The ${client.user.username}`, client.user.displayAvatarURL({ dynamic: true }));
		await message.reply({ embeds: [ embed ], files: [ attachment ] });
	},
	async executeSlash(interaction, client) {
		const reqColor = interaction.options.getString('color')?.toUpperCase() ?? randHexColor();

		if (!hexRegex.test(reqColor)) {
			return await interaction.reply('The color must be in hexadecimal form. Try using `#FF0000`.');
		}

		await interaction.deferReply();
		const color = await yuricanvas.color(reqColor);
		const attachment = new MessageAttachment(color, 'color.png');
		const embed = new MessageEmbed()
			.setTitle(reqColor)
			.setColor(reqColor)
			.setImage('attachment://color.png')
			.setFooter(`The ${client.user.username}`, client.user.displayAvatarURL({ dynamic: true }));

		await interaction.editReply({ embeds: [ embed ], files: [ attachment ] });
	},
};