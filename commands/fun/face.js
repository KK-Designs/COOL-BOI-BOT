const { MessageEmbed } = require('discord.js');
const cool = require('cool-ascii-faces');
module.exports = {
	name: 'face',
	description: 'Gives a random ascii face ( ͝° ͜ʖ͡°)',
	cooldown: 3,
	category: 'fun',
	options: {},
	async execute(message) {
		const embed = new MessageEmbed()
			.setTitle('Ascii face')
			.setDescription(`\`\`${cool().toString()}\`\``)
			.setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
			.setTimestamp()
			.setColor(message.member?.displayHexColor ?? '#FFB700');

		await message.reply({ embeds: [embed] });
	},
	async executeSlash(interaction) {
		const embed = new MessageEmbed()
			.setTitle('Ascii face')
			.setDescription(`\`\`${cool().toString()}\`\``)
			.setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
			.setTimestamp()
			.setColor(interaction.member?.displayHexColor ?? '#FFB700');

		await interaction.reply({ embeds: [embed] });
	},
};
