const { MessageEmbed } = require('discord.js');
const { codeBlock } = require('@discordjs/builders');
const humanizeDuration = require('humanize-duration');
module.exports = {
	name: 'queue',
	description: 'View the server queue.',
	aliases: ['q'],
	guildOnly: true,
	cooldown: 1.5,
	category: 'music',
	options: {
		clear: {
			type: 'Subcommand',
			description: 'Clear the queue',
			options: {
				raw_json: {
					type: 'Boolean',
					description: 'Whether to show the queue as a json object (default: false)',
					required: false,
				},
			},
		},
		view: {
			type: 'Subcommand',
			description: 'View the queue',
			options: {},
		},
	},
	async execute(message, args) {
		const serverQueue = message.client.queue.get(message.guild.id);

		if (!serverQueue) {return await message.reply({ content: 'There is nothing playing.' });}

		if (args[0]) {

			if (args[0].toLowerCase() === 'raw_json') {
				message.client.queue.delete(message.guild.id);
				await message.reply({
					embeds: [
						new MessageEmbed()
							.setColor('ORANGE')
							.setDescription(`${codeBlock('json', JSON.stringify(serverQueue))}`),
					],
				});
			}
			if (args[0].toLowerCase() === 'clear') {
				await message.reply({
					embeds: [
						new MessageEmbed()
							.setColor('GREEN')
							.setDescription(`${message.author} 🗑️ cleared \`${serverQueue.songs.length}\` songs`),
					],
				});

				return await message.client.queue.delete(message.guild.id);
			}

		}
		const embed = new MessageEmbed()
			.setColor(message.guild.me.displayHexColor)
			.setTitle(`Queue for ${message.guild.name}\n`)
			.setDescription(`${serverQueue.songs.map(song => `<:line:812833164103778344> **${song.title} | ${humanizeDuration(song.duration * 1000)}**`).join('\n')}`)
			.addField('Now playing:', `${serverQueue.songs[0].title} • ${serverQueue.songs[0].author}`, true)
			.setTimestamp()
			.setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

		if (embed.description.length >= 4096) {
			embed.description = `${embed.description.substr(0, 4093)}...`;
		}
		await message.reply({ embeds: [embed] });
	},
	async executeSlash(interaction) {
		const serverQueue = interaction.client.queue.get(interaction.guild.id);

		if (!serverQueue) {return await interaction.reply({ content: 'There is nothing playing.' });}

		const subCmd = interaction.options.getSubcommand(true);
		switch (subCmd) {
		case 'clear': {
			const embed = new MessageEmbed()
				.setColor('GREEN')
				.setDescription(`${interaction.user} 🗑️ cleared \`${serverQueue.songs.length}\` songs`);
			const raw = interaction.options.getBoolean('raw_json') ?? false;
			if (raw) {
				embed.setDescription(`${codeBlock('json', JSON.stringify(serverQueue))}`);
			}
			await interaction.reply({
				embeds: [embed],
			});

			return await interaction.client.queue.delete(interaction.guild.id);
		}
		case 'view': {
			const embed = new MessageEmbed()
				.setColor(interaction.guild.me.displayHexColor)
				.setTitle(`Queue for ${interaction.guild.name}\n`)
				.setDescription(`${serverQueue.songs.map(song => `<:line:812833164103778344> **${song.title} | ${humanizeDuration(song.duration * 1000)}**`).join('\n')}`)
				.addField('Now playing:', `${serverQueue.songs[0].title} • ${serverQueue.songs[0].author}`, true)
				.setTimestamp()
				.setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

			if (embed.description.length >= 4096) {
				embed.description = `${embed.description.substr(0, 4093)}...`;
			}
			await interaction.reply({ embeds: [embed] });
		} break;
		default: {
			throw new Error('Unknown Subcommand');
		}
		}
	},
};