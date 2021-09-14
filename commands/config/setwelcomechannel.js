module.exports = {
	name: 'setwelcomechannel',
	description: 'Set the bots welcome channel. do `!setwelcomeChannel none` to reset this config',
	cooldown: 5,
	guildOnly: true,
	permissions: 'ADMINISTRATOR',
	usage: '[channel] or (`none` to clear)',
	category: 'config',
	async execute(message, args, client) {
		const { MessageEmbed } = require('discord.js');				
		const db = require('quick.db');
		const x = message.mentions.channels.first() || message.guild.channels.cache.find(channel => channel.name === (args[0])) || message.guild.channels.cache.get(args[0]);
		const color = require('../../color.json');

		if (!args[0] && !x) return message.reply({ embeds: [
			new MessageEmbed()
				.setColor(color.fail)
				.setDescription(`<:X_:807305490160943104> An invalid argument was provided. The only 2 valid ones are \`none\` to reset configuration or \`[channel]\` to set a welcome channel.`),
		]})

		if (args[0].toLowerCase() === 'none' || args[0].toLowerCase() === 'disable') {
			message.reply({ embeds: [
				new MessageEmbed()
					.setColor(color.success)
					.setDescription(`<:check:807305471282249738> Stopped logging members`),
			]});
			return await db.set(`welcomechannel_${message.guild.id}`, '0');
		}

		if (!x) return message.reply({ embeds: [
			new MessageEmbed()
				.setColor(color.fail)
				.setDescription(`<:X_:807305490160943104> Please specify a valid channel.`),
		]});

		await db.set(`welcomechannel_${message.guild.id}`, x.id);
		message.reply({ embeds: [
			new MessageEmbed()
				.setColor(color.success)
				.setDescription(`<:check:807305471282249738> Succesfuly set welcome channel to ${x}`),
		]});	
	},
};