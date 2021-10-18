module.exports = {
	name: 'emojis',
	description: 'List the server\'s emojis!',
	aliases: ['listemoji'],
	cooldown: 3,
	category: 'info',
	async execute(message, args, client) {
		const { MessageEmbed } = require('discord.js');
		const { bold, inlineCode } = require('@discordjs/builders');
		const guild = message.guild;
		const color = require('../../color.json');
		const emoji = client.emojis.cache.get(args[0]);

		if (!emoji && args[0]) {
			return await message.reply({ embeds: [
				new MessageEmbed()
					.setColor(color.fail)
					.setDescription('<:X_:807305490160943104> I need a valid emoji to get it\'s info!'),
			] });
		}

		if (emoji) {
			const embed = new MessageEmbed()
				.setTitle(`Info for ${inlineCode(emoji.name)} : `)
				.addField('Emoji: ', emoji.animated ? `<a:${emoji.name}:${emoji.id}>` : `<:${emoji.name}:${emoji.id}>`, true)
				.addField('Name: ', emoji.name, true)
				.addField('ID: ', emoji.id, true)
				.addField('Url: ', emoji.url, true)
				.addField('Animated: ', emoji.animated ? 'Emoji is animated' : 'Emoji is not animated', true)
				.setThumbnail(emoji.url)
				.setFooter(emoji.name, emoji.url)
				.setTimestamp()
				.setColor(message.channel.type === 'GUILD_TEXT' ? message.guild.me.displayHexColor : '#FFB700');

			return await message.reply({ embeds: [embed] });
		}
		const embed = new MessageEmbed()
			.setTitle(`${guild.name}'s emoji's:\n`)
			.setDescription(`${guild.emojis.cache.map(emojis => emojis.toString()).join(` ${bold('|')} `)}`)
			.setFooter(guild.name, guild.iconURL({ dymamic: true }))
			.setTimestamp()
			.setColor(message.channel.type === 'GUILD_TEXT' ? message.guild.me.displayHexColor : '#FFB700');

		message.reply({ embeds: [embed] });
	},
};