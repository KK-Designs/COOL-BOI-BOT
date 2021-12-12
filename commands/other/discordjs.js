const { MessageActionRow, MessageButton } = require('discord.js');
const fetch = require('node-fetch').default;
module.exports = {
	name: 'discordjs',
	description: 'Gets discord.js v13 docs <:djs:882691182692532254>',
	cooldown: 3,
	aliases: ['djs'],
	usage: '[search term]',
	category: 'other',
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
};