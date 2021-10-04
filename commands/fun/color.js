const yuricanvas = require('yuri-canvas');
const { MessageEmbed, MessageAttachment } = require('discord.js');
module.exports = {
	name: 'color',
	description: 'Sends a random or specified color!',
	cooldown: 5,
	category: 'fun',
	options: {
		color: {
			type: 'String',
			description: 'The color to display',
			required: false,
		},
	},
	async execute(message, args, client) {
		if (args[0] && /^#([0-9A-F]{3}){1,2}$/i.test(args[0])) {
			const color = await yuricanvas.color(args[0]);
			const attachment = new MessageAttachment(color, 'color.png');
			const embed = new MessageEmbed()
				.setTitle(args[0])
				.setColor(args[0])
				.setImage('attachment://color.png')
				.setFooter(`The ${client.user.username}`, client.user.displayAvatarURL({ dynamic: true }));
			message.reply({ embeds: [ embed ], files: [ attachment ] });
		}
		if (!args[0]) {
			const ranColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
			const color = await yuricanvas.color(ranColor);
			const attachment = new MessageAttachment(color, 'color.png');
			const embed = new MessageEmbed()
				.setTitle(ranColor)
				.setColor(ranColor)
				.setImage('attachment://color.png')
				.setFooter(`The ${client.user.username}`, client.user.displayAvatarURL({ dynamic: true }));
			message.reply({ embeds: [ embed ], files: [ attachment ] });
		}
	},
	async executeSlash(interaction, client) {
		const wait = require('util').promisify(setTimeout);
		await interaction.deferReply();
		await wait(750);
		const args = interaction.options.getString('color');
		if (args && /^#([0-9A-F]{3}){1,2}$/i.test(args)) {
			const color = await yuricanvas.color(args);
			const attachment = new MessageAttachment(color, 'color.png');
			const embed = new MessageEmbed()
				.setTitle(args)
				.setColor(args)
				.setImage('attachment://color.png')
				.setFooter(`The ${client.user.username}`, client.user.displayAvatarURL({ dynamic: true }));
			interaction.editReply({ embeds: [ embed ], files: [ attachment ] });
		}
		if (!args) {
			const ranColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
			const color = await yuricanvas.color(ranColor);
			const attachment = new MessageAttachment(color, 'color.png');
			const embed = new MessageEmbed()
				.setTitle(ranColor)
				.setColor(ranColor)
				.setImage('attachment://color.png')
				.setFooter(`The ${client.user.username}`, client.user.displayAvatarURL({ dynamic: true }));
			interaction.editReply({ embeds: [ embed ], files: [ attachment ] });
		}
	},
};