const { MessageActionRow, MessageButton } = require('discord.js');
const fetch = require('node-fetch').default;
module.exports = {
	name: 'discordjs',
	description: 'Gets discord.js v13 docs <:djs:882691182692532254>',
	cooldown: 3,
	aliases: ['djs'],
	usage: '[search term]',
	category: 'other',
	options: {
		query: {
			type: 'String',
			description: 'The d.js class, method, event, or type to search for',
		},
	},
	async execute(message, args) {
		const sendError = require('../../error.js');

		if (!args.length) {return sendError('You need to supply search term like `${prefix}discordjs member`', message.channel);}

		const search = args.join(' ');
		const res = await fetch(`https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(search)}`);
		const embed = await res.json();
		const deletemsg = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('danger')
					.setLabel('Delete')
					.setEmoji('🗑')
					.setStyle('DANGER'),
			);

		await message.reply({ embeds: [embed], components: [deletemsg] }).then(m => {
			const filter = i => i.customId === 'danger';
			const collector = message.channel.createMessageComponentCollector({ filter, time: 15000 });

			collector.on('collect', async i => {
				if (i.user.id === message.author.id) {
					if (i.customId === 'danger') {
						await i.reply({ content: '<:check:807305471282249738> I have deleted the message', ephemeral: true });
						await m.delete();
					}
				} else {
					await i.reply({ content: '<:X_:807305490160943104> These aren\'t your buttons to play around with', ephemeral: true });
				}
			});
			collector.on('end', () => {
				const deletemsg1 = new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setCustomId('danger')
							.setLabel('Delete')
							.setEmoji('🗑')
							.setStyle('DANGER')
							.setDisabled(true),
					);

				m.edit({ components: [deletemsg1] });
			});
		});


	},
	/** @param {import("discord.js").CommandInteraction} interaction */
	async executeSlash(interaction) {
		const search = interaction.options.getString('query', true);
		const res = await fetch(`https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(search)}`);
		if (!res.ok) {
			return await interaction.reply(`HTTP Error ${res.status}: ${res.statusText}`);
		}
		const embed = await res.json();
		const deletemsg = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('danger')
					.setLabel('Delete')
					.setEmoji('🗑')
					.setStyle('DANGER'),
			);

		/** @type {import("discord.js").Message} */
		const m = (await interaction.reply({ embeds: [embed], components: [deletemsg], fetchReply: true }));
		const filter = i => i.customId === 'danger';
		const collector = m.createMessageComponentCollector({ filter, time: 15000, componentType: 'BUTTON' });

		collector.on('collect', async i => {
			if (i.user.id === interaction.user.id) {
				if (i.customId === 'danger') {
					await i.reply({ content: '<:check:807305471282249738> I have deleted the message', ephemeral: true });
					await m.delete();
				}
			} else {
				await i.reply({ content: '<:X_:807305490160943104> These aren\'t your buttons to play around with', ephemeral: true });
			}
		});
		collector.on('end', async (_, reason) => {
			if (reason !== 'time') {return;}
			const deletemsg1 = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('danger')
						.setLabel('Delete')
						.setEmoji('🗑')
						.setStyle('DANGER')
						.setDisabled(true),
				);

			await m.edit({ components: [deletemsg1] });
		});


	},
};