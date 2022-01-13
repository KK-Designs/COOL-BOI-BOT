const prefix = require('discord-prefix');
const { MessageEmbed } = require('discord.js');
const color = require('../../color.json');
const config = require('../../config.json');
module.exports = {
	name: 'prefix',
	description: 'Get the bots prefix! ***This command prefix is always `!` ***',
	cooldown: 2,
	guildOnly: true,
	category: 'config',
	clientPermissons: 'EMBED_LINKS',
	permissons: 'ADMINISTRATOR',
	options: {},
	async execute(message) {
		const { client } = message;
		const guildPrefix = prefix.getPrefix(message.guild?.id ?? message.author.id) ?? config.defaultPrefix;
		const embed = new MessageEmbed()
			.setTitle(`The bots prefix is ${guildPrefix}`)
			.setColor(message.guild?.me.displayHexColor ?? color.discord)
			.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
			.setDescription('This command prefix is always `!` or a @mention')
			.setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
			.setTimestamp();

		await message.reply({ embeds: [embed] });
	},
	async executeSlash(interaction) {
		const { client } = interaction;
		const guildPrefix = prefix.getPrefix(interaction.guild?.id ?? interaction.user.id) ?? config.defaultPrefix;
		const embed = new MessageEmbed()
			.setTitle(`The bots prefix is ${guildPrefix}`)
			.setColor(interaction.guild?.me.displayHexColor ?? color.discord)
			.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
			.setDescription('This command prefix is always `!` or a @mention')
			.setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
			.setTimestamp();

		await interaction.reply({ embeds: [embed] });
	},
};
