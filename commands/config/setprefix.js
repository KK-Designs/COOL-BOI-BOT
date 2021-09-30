const { MessageEmbed } = require('discord.js');
const prefix = require('discord-prefix');
const color = require('../../color.json');
module.exports = {
	name: 'setprefix',
	description: 'Set the bots prefix!',
	cooldown: 5,
	permissions: 'ADMINISTRATOR',
	usage: '[prefix]',
	guildOnly: true,
	category: 'config',
	options: {
		prefix: {
			type: 'String',
			description: 'The new prefix for the bot',
		},
		reset: {
			type: 'Boolean',
			description: 'If I should reset the bots prefix',
			required: false,
		},
	},
	execute(message, args) {
		const guild = message.guild;

		if (!args.length || args[0].toLowerCase() === 'disable' || args[0].toLowerCase() === 'none') {
			setTimeout(() => { prefix.setPrefix('!', guild.id); }, 700);

			return message.reply({ embeds: [
				new MessageEmbed()
					.setColor(color.success)
					.setDescription('<:check:807305471282249738> Reset the bots prefix to `!`'),
			] });
		}
		else if (args[0].length > 3) {
			return message.reply({ embeds: [
				new MessageEmbed()
					.setColor(color.fail)
					.setDescription('<:X_:807305490160943104> I can\'t set the prefix to anything more than 3'),
			] });
		}
		prefix.setPrefix(args[0], guild.id);
		message.reply({ embeds: [
			new MessageEmbed()
				.setColor(color.success)
				.setDescription(`<:check:807305471282249738> Prefix was succesfully changed to ${args[0]}\n\n *you can check the new prefix by running '<@811024409863258172> prefix'*`),
		] });
	},
	async executeSlash(interaction) {
		const newPrefix = interaction.options.getString('prefix', true);
		const reset = interaction.options.getBoolean('reset');
		const guild = interaction.guild;

		if (reset) {
			setTimeout(() => { prefix.setPrefix('!', guild.id); }, 700);

			return interaction.reply({ embeds: [
				new MessageEmbed()
					.setColor(color.success)
					.setDescription('<:check:807305471282249738> Reset the bots prefix to `!`'),
			] });
		}
		else if (newPrefix.length > 3) {
			return interaction.reply({ embeds: [
				new MessageEmbed()
					.setColor(color.fail)
					.setDescription('<:X_:807305490160943104> I can\'t set the prefix to anything more than 3'),
			] });
		}
		prefix.setPrefix(newPrefix, guild.id);
		interaction.reply({ embeds: [
			new MessageEmbed()
				.setColor(color.success)
				.setDescription(`<:check:807305471282249738> Prefix was succesfully changed to ${newPrefix}\n\n *you can check the new prefix by running '${interaction.client.user} prefix'*`),
		] });
	},
};