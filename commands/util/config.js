module.exports = {
	name: 'config',
	description: 'View the bots configuration',
	cooldown: 2,
	guildOnly: true,
	category: 'util',
	aliases: ['configuration', 'viewconfig'],
	execute(message, args, client) {
		const db = require('quick.db');
		const prefix = require('discord-prefix');
		const color = require('../../color.json');
		const guildPrefix = prefix.getPrefix(message.channel.type === 'DM' ? message.author.id : message.guild.id);
		const { MessageEmbed } = require('discord.js');
		const embed = new MessageEmbed()
			.setTitle(`${message.guild.name} config`)
			.setThumbnail(message.guild.iconURL())
			.addFields(
				{ name: '**Prefix**', value: `${guildPrefix == null ? '!' : guildPrefix}`, inline: true },
				{ name: '**Audit logging channel**', value: `${db.get('loggingchannel_' + message.guild.id) === '0' ? `None, do \`${guildPrefix == null ? '!' : guildPrefix}setlogChannel [#channel]\` to configure this.` : '<#' + db.get('loggingchannel_' + message.guild.id) + '>'}`, inline: true },
				{ name: '**Welcome channel**', value: `${db.get('welcomechannel_' + message.guild.id) === '0' ? `None, do \`${guildPrefix == null ? '!' : guildPrefix}setwelcomeChannel [#channel]\` to configure this.` : '<#' + db.get('welcomechannel_' + message.guild.id) + '>'}`, inline: true },
			)
			.setTimestamp()
			.setFooter(message.guild.name, message.guild.iconURL())
			.setColor(message.channel.type === 'DM' ? '#FFB700' : message.guild.me.displayHexColor,
			);

		message.reply({ embeds: [embed] });

	},
};