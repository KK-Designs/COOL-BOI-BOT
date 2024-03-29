const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const color = require('../../color.json');
const { getLogChannel } = require('../../utils.js');
const config = require('../../config.json');
module.exports = {
	name: 'setlogchannel',
	description:
		'Set the bots audit logging channel. Do `setlogChannel none` to reset this config',
	cooldown: 5,
	guildOnly: true,
	permissions: 'ADMINISTRATOR',
	usage: '[channel name] or (`none` to clear)',
	category: 'config',
	options: {
		set: {
			type: 'Subcommand',
			description: 'Set the log channel',
			options: {
				channel: {
					type: 'Channel',
					description: 'The channel to send logs to',
					channelTypes: ['GUILD_TEXT'],
				},
			},
		},
		reset: {
			type: 'Subcommand',
			description: 'Disable the log channel',
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
					.setDescription('<:X_:807305490160943104> An invalid argument was provided. The only 2 valid ones are `none` to reset configuration or `[channel]` to set a logging channel.'),
			] });
		}
		if (args[0].toLowerCase() === 'none' || args[0].toLowerCase() === 'disable') {
			await message.reply({ embeds: [
				new MessageEmbed()
					.setColor(color.success)
					.setDescription('<:check:807305471282249738> Stopped logging events'),
			] });

			return await db.delete(`loggingchannel_${message.guild.id}`);
		}
		if (!x) {
			return await message.reply({ embeds: [
				new MessageEmbed()
					.setColor(color.fail)
					.setDescription('<:X_:807305490160943104> Please specify a valid channel.'),
			] });
		}
		await db.set(`loggingchannel_${message.guild.id}`, x.id);
		const webhook = await getLogChannel(message.guild, db).createWebhook(`${message.client.user.username} Logging`, {
			avatar: config.webhookAvatarURL,
		});

		console.log(`Created webhook ${JSON.stringify(webhook)}`);
		await message.reply({ embeds: [
			new MessageEmbed()
				.setColor(color.success)
				.setDescription(`<:check:807305471282249738> Succesfuly set logging channel to ${x}`),
		] });
	},
	async executeSlash(interaction) {
		const sub = interaction.options.getSubcommand(true);

		if (sub === 'reset') {
			await interaction.reply({ embeds: [
				new MessageEmbed()
					.setColor(color.success)
					.setDescription('<:check:807305471282249738> Stopped logging events'),
			] });

			return await db.delete(`loggingchannel_${interaction.guild.id}`);
		}
		const x = interaction.options.getChannel('channel', true);

		if (!x) {
			return await interaction.reply({ embeds: [
				new MessageEmbed()
					.setColor(color.fail)
					.setDescription('<:X_:807305490160943104> Please specify a valid channel.'),
			] });
		}
		await db.set(`loggingchannel_${interaction.guild.id}`, x.id);
		const webhook = await getLogChannel(interaction.guild, db).createWebhook(`${interaction.client.user.username} Logging`, {
			avatar: config.webhookAvatarURL,
		});

		console.log(`Created webhook ${JSON.stringify(webhook)}`);
		await interaction.reply({ embeds: [
			new MessageEmbed()
				.setColor(color.success)
				.setDescription(`<:check:807305471282249738> Succesfuly set logging channel to ${x}`),
		] });
	},
};
