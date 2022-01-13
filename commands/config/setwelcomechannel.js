const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const color = require('../../color.json');
module.exports = {
	name: 'setwelcomechannel',
	description: 'Set the bots member logging channel. Do `/setWelcomeChannel none` to reset this config',
	cooldown: 5,
	guildOnly: true,
	permissions: 'ADMINISTRATOR',
	usage: '[channel] or (`none` to clear)',
	category: 'config',
	options: {
		set: {
			type: 'Subcommand',
			description: 'Set the welcome channel',
			options: {
				channel: {
					type: 'Channel',
					description: 'The channel to send welcome messages to',
					channelTypes: ['GUILD_TEXT'],
				},
			},
		},
		reset: {
			type: 'Subcommand',
			description: 'Disable the welcome channel',
			required: false,
			options: {},
		},
	},
	async execute(message, args) {
		const x = message.mentions.channels.first() || message.guild.channels.cache.find(channel => channel.name === args[0]) || message.guild.channels.cache.get(args[0]);

		if (!args[0] && !x) {
			return await message.reply({ embeds: [
				new MessageEmbed()
					.setColor(color.fail)
					.setDescription('<:X_:807305490160943104> An invalid argument was provided. The only 2 valid ones are `none` to reset configuration or `[channel]` to set a welcome channel.'),
			] });
		}

		if (args[0].toLowerCase() === 'none' || args[0].toLowerCase() === 'disable') {
			await message.reply({ embeds: [
				new MessageEmbed()
					.setColor(color.success)
					.setDescription('<:check:807305471282249738> Stopped logging members'),
			] });

			return await db.set(`welcomechannel_${message.guild.id}`, '0');
		}
		if (!x) {
			return await message.reply({ embeds: [
				new MessageEmbed()
					.setColor(color.fail)
					.setDescription('<:X_:807305490160943104> Please specify a valid channel.'),
			] });
		}

		await db.set(`welcomechannel_${message.guild.id}`, x.id);
		await message.reply({ embeds: [
			new MessageEmbed()
				.setColor(color.success)
				.setDescription(`<:check:807305471282249738> Succesfuly set welcome channel to ${x}`),
		] });
	},
	async executeSlash(interaction) {
		const sub = interaction.options.getSubcommand(true);

		if (sub === 'reset') {
			await interaction.reply({ embeds: [
				new MessageEmbed()
					.setColor(color.success)
					.setDescription('<:check:807305471282249738> Stopped logging members'),
			] });

			return db.delete(`welcomechannel_${interaction.guild.id}`);
		}
		const x = interaction.options.getChannel('channel', true);

		if (!x) {
			return await interaction.reply({ embeds: [
				new MessageEmbed()
					.setColor(color.fail)
					.setDescription('<:X_:807305490160943104> Please specify a valid channel.'),
			] });
		}
		await db.set(`welcomechannel_${interaction.guild.id}`, x.id);

		await interaction.reply({ embeds: [
			new MessageEmbed()
				.setColor(color.success)
				.setDescription(`<:check:807305471282249738> Succesfuly set welcome channel to ${x}`),
		] });
	},
};
