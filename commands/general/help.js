module.exports = {
	name: 'help',
	description: 'Gives you information about each command!',
	usage: '(command name)',
	aliases: ['commands'],
	cooldown: 3,
	category: 'general',
	clientPermissons: 'EMBED_LINKS',
	execute(message, args) {
		const user = message.author;
		const prefix = require('discord-prefix');
		const guildPrefix = prefix.getPrefix(message.channel.type === 'dm' ? message.author.id : message.guild.id);
		const { MessageActionRow, MessageSelectMenu } = require('discord.js');
		const { MessageEmbed } = require('discord.js');
		const { suggest } = require('@laboralphy/did-you-mean');
		const fs = require('fs');
		const data = [];
		const { commands } = message.client;

		if (!args.length) {
			data.push(commands.map(command => `\`${command.name}\``).join(' | '));
			data.push(`\nYou can use \`${guildPrefix == null ? '!' : guildPrefix}help [command name]\` to get info on a specific command. Use \`${guildPrefix == null ? '!' : guildPrefix}help [category name]\` to get specific category commands. Make sure to use \`${guildPrefix == null ? '!' : guildPrefix}\` or @mention me before each command!`);

			const embed = new MessageEmbed()
				.setTitle('Commands')
				.setDescription(data.toString())
				.setFooter('THE COOL BOI BOT', 'https://images-ext-2.discordapp.net/external/PtRqDuS2wA-2WgNWTTLOwbG-B6ioUW6YPiRtxgs4ap4/https/cdn.discordapp.com/avatars/769415264306987068/699aa52d1dd597538fc33ceef502b1e6.webp')
				.setTimestamp()
				.setColor(message.channel.type === 'dm' ? '#FFB700' : message.guild.me.displayHexColor);

			return message.channel.send({ embeds: [ embed ] });
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		const categorynames = [
			'fun',
			'general',
			'games',
			'image',
			'info',
			'levels',
			'moderation',
			'music',
			'other',
			'config',
		];

		if (name === 'category' || name === 'categories') {
			const categoryMenu = new MessageActionRow()
				.addComponents(
					new MessageSelectMenu()
						.setCustomId('categorySelectMenu')
						.setPlaceholder('Click here to select a category')
						.addOptions([
							{
								label: 'Fun',
								description: 'All of the commands in the "fun" category',
								value: 'fun',
							},
							{
								label: 'General',
								description: 'All of the commands in the "general" category',
								value: 'general',
							},
							{
								label: 'Games',
								description: 'All of the commands in the "games" category',
								value: 'games',
							},
							{
								label: 'Image',
								description: 'All of the commands in the "image" category',
								value: 'image',
							},
							{
								label: 'Info',
								description: 'All of the commands in the "info" category',
								value: 'info',
							},
							{
								label: 'Levels',
								description: 'All of the commands in the "levels" category',
								value: 'levels',
							},
							{
								label: 'Moderation',
								description: 'All of the commands in the "moderation" category',
								value: 'moderation',
							},
							{
								label: 'Music',
								description: 'All of the commands in the "music" category',
								value: 'music',
							},
							{
								label: 'Other',
								description: 'All of the commands in the "other" category',
								value: 'other',
							},
							{
								label: 'Config',
								description: 'All of the commands in the "Config" category',
								value: 'config',
							},
						]),
				);

			const categoryEmbed = new MessageEmbed()
				.setTitle('All categories')
				.setDescription(`\`${categorynames.join('` | `')}\``)
				.setFooter('THE COOL BOI BOT', `${message.client.user.displayAvatarURL({ dynamic: true })}`)
				.setTimestamp()
				.setColor(message.channel.type === 'dm' ? '#FFB700' : message.guild.me.displayHexColor);
			return message.channel.send({ embeds: [ categoryEmbed ], components: [ categoryMenu ], reply: { messageReference: message.id } }).then(m => {
				const collector = m.createMessageComponentCollector({ componentType: 'SELECT_MENU', time: 60000 });
				collector.on('collect', i => {
					if (i.customId === 'categorySelectMenu') {
						if (i.user.id === message.author.id) {
							const category = commands.filter(command => command.category === i.values[0]);
							const cmds = [];
							const categorycmd = category.map(command => `\`${command.name}\``);
							cmds.push(categorycmd.join(' | '));
							cmds.push(`\n\nYou can use \`${guildPrefix == null ? '!' : guildPrefix}help [command name]\` to get info on a specific command. Make sure to use \`${guildPrefix == null ? '!' : guildPrefix}\` or @mention me before each command!`);
							const categoryEmbed1 = new MessageEmbed()
								.setTitle(`Commands in ${i.values[0]}`)
								.setDescription(`${cmds}`)
								.setFooter('THE COOL BOI BOT', `${message.client.user.displayAvatarURL({ dynamic: true })}`)
								.setTimestamp()
								.setColor(message.channel.type === 'dm' ? '#FFB700' : message.guild.me.displayHexColor);
							i.update({ embeds: [ categoryEmbed1 ], components: [ categoryMenu ] });
						}
						else {
							i.reply({ content: '<:X_:807305490160943104> You are not allowed to use the select menu on this command', ephemeral: true });
						}
					}
				});

				collector.on('end', collected => {
					const categoryMenu1 = new MessageActionRow()
						.addComponents(
							new MessageSelectMenu()
								.setCustomId('categorySelectMenu')
								.setPlaceholder('Click here to select a category')
								.addOptions([
									{
										label: 'Fun',
										description: 'All of the commands in the "fun" category',
										value: 'fun',
									},
									{
										label: 'General',
										description: 'All of the commands in the "general" category',
										value: 'general',
									},
									{
										label: 'Games',
										description: 'All of the commands in the "games" category',
										value: 'games',
									},
									{
										label: 'Image',
										description: 'All of the commands in the "image" category',
										value: 'image',
									},
									{
										label: 'Info',
										description: 'All of the commands in the "info" category',
										value: 'info',
									},
									{
										label: 'Levels',
										description: 'All of the commands in the "levels" category',
										value: 'levels',
									},
									{
										label: 'Moderation',
										description: 'All of the commands in the "moderation" category',
										value: 'moderation',
									},
									{
										label: 'Music',
										description: 'All of the commands in the "music" category',
										value: 'music',
									},
									{
										label: 'Other',
										description: 'All of the commands in the "other" category',
										value: 'other',
									},
									{
										label: 'Config',
										description: 'All of the commands in the "Config" category',
										value: 'config',
									},
								])
								.setDisabled(true),
		  );
					m.edit({ components: [categoryMenu1] });
				});
			});
		}

		if (categorynames.includes(name)) {
			const category = commands.filter(command => command.category === name);
			const cmds = [];
			const categorycmd = category.map(command => `\`${command.name}\``);
			cmds.push(categorycmd.join(' | '));
			cmds.push(`\n\nYou can use \`${guildPrefix == null ? '!' : guildPrefix}help [command name]\` to get info on a specific command. Make sure to use \`${guildPrefix == null ? '!' : guildPrefix}\` or @mention me before each command!`);

			const embed1 = new MessageEmbed()
				.setTitle(`Commands in ${name}`)
				.setDescription(`${cmds}`)
				.setFooter('THE COOL BOI BOT', `${message.client.user.displayAvatarURL({ dynamic: true })}`)
				.setTimestamp()
				.setColor(message.channel.type === 'dm' ? '#FFB700' : message.guild.me.displayHexColor);
			message.channel.send({ embeds: [ embed1 ], reply: { messageReference: message.id } });
		}

		if (!command && !categorynames.includes(name)) {
			const thing = commands.map(command => command.name);
			const result = suggest(name, thing);
			let error = `that\'s not a valid command, did you mean \`${result.join(' or ')}\`?`;
			if (!result.length) {
				error = 'that\'s not a valid command!';
			}
			return message.channel.send({ content: `${error}`, reply: { messageReference: message.id } });
		}

		if (command.usage == undefined) {command.usage = ' ';}
		data.push(`**Name:** ${command.name}`);
		const aliasesinfo = [];
		const aliasename = [];
		const perms = [];
		if (command.aliases) {
			aliasesinfo.push(`${command.aliases.join(', ')}`);
			aliasename.push('**Aliases**');
		}
		else if (command.aliases == undefined) {
			aliasesinfo.push('** **');
			aliasename.push('** **');
		}

		if (command.permissions) {
			perms.push(`\`${command.permissions}\`, \`SEND_MESSAGES\`, \`VIEW_CHANNEL\``);
		}
		else if (command.permissions == null) {
			perms.push('`SEND_MESSAGES`, `VIEW_CHANNEL`');
		}

		const data1 = [];
		if (command.guildOnly) {
			data1.push('This command can be used only in servers');
		}
		else {
			data1.push('This command can be used in servers and dms');
		}

		const embed = new MessageEmbed()
			.setTitle(`Command Name: ${command.name}`)
			.addFields(
				{ name: '**Description**', value: `${command.description}`, inline: true },
				{ name: '**Usage**', value: `${guildPrefix == null ? '!' : guildPrefix}${command.name} ${command.usage}`, inline: true },
				{ name: '**Cooldown**', value: `${command.cooldown || 3} seconds`, inline: true },
				{ name: '**Category**', value: `${command.category}`, inline: true },
				{ name: `${aliasename}`, value: `${aliasesinfo}`, inline: true },
				{ name: '**Permissions**', value: `${perms}`, inline: true },
				{ name: '**Bot Permissions**', value: `\`${command.clientPermissons == undefined ? 'VIEW_CHANNEL' : command.clientPermissons}\`, \`SEND_MESSAGES\` `, inline: true },
				{ name: '**Last updated**', value: `${new Date((fs.statSync(`/root/COOL-BOI-BOT/commands/${command.category}/${command.name.toLowerCase()}.js`).mtime)).toLocaleString('en-US', { timeZone: 'America/los_angeles' }) || 'No date avavible'}`, inline: true },
			)
			.addField(data1.toString(), '** **')
			.setDescription('[] arguments mean required, and () arguments mean optional. If theres none it means the there are no arguments nedded to run the command')
			.setFooter(user.username, user.displayAvatarURL({ dynamic: true }))
			.setTimestamp()
			.setColor(message.channel.type === 'dm' ? '#FFB700' : message.guild.me.displayHexColor,
			);

		message.channel.send({ embeds: [ embed ], reply: { messageReference: message.id } });
	},
};
