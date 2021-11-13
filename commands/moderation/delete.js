const { setTimeout: wait } = require('timers/promises');
const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'delete',
	description: 'Purges the spcified amount! If none spcified deletes the first 100 messages',
	guildOnly: true,
	aliases: ['purge', 'clear'],
	usage: '(number)',
	permissions: 'MANAGE_MESSAGES',
	clientPermissons: ['EMBED_LINKS', 'MANAGE_MESSAGES'],
	cooldown: 3,
	category: 'moderation',
	options: {
		number: {
			type: 'Integer',
			description: 'The number of messages to delete',
			required: false,
		},
	},
	async execute(message, args) {
		try {
			if (!args[0]) {
				const fetched = await message.channel.messages.fetch({ limit: 100 });
				const pinned = await message.channel.messages.fetchPinned();
				const notPinned = fetched.filter(fetchedMsg => !fetchedMsg.pinned);
				if ((fetched.size - 1) == 0) {
					return await message.reply({ embeds: [
						new MessageEmbed()
							.setColor('RED')
							.setDescription('<:X_:807305490160943104> There are no new messages to delete'),
					] }).then(msg => {setTimeout(function() { message.delete(); msg.delete(); }, 3000); });
				}
				return await message.channel.bulkDelete(notPinned, await message.reply({ embeds: [
					new MessageEmbed()
						.setColor('GREEN')
						.setDescription(`<:check:807305471282249738> ${fetched.size - 1} messages deleted${pinned.size == 0 ? ' ' : `\n\n️ℹ ${pinned.size} messages ignored`}`),
				] }).then(msg => {setTimeout(function() { msg.delete(); }, 3000); }), true);
			}
			const amount = parseInt(args[0]) + 1;
			if (isNaN(amount)) {
				return await message.reply({ embeds: [
					new MessageEmbed()
						.setColor('RED')
						.setDescription('<:X_:807305490160943104> That doesn\'t seem to be a valid number.'),
				], reply: { messageReference: message.id } });
			}
			else if (amount <= 1 || amount > 100) {
				return await message.reply({ embeds: [
					new MessageEmbed()
						.setColor('RED')
						.setDescription('<:X_:807305490160943104> You need to input a number between 1 and 99.'),
				], reply: { messageReference: message.id } });
			}
			const fetched = await message.channel.messages.fetch({ limit: amount });
			const pinned = await message.channel.messages.fetchPinned();
			const notPinned = fetched.filter(fetchedMsg => !fetchedMsg.pinned);
			if ((fetched.size - 1) == 0) {
				return await message.reply({ embeds: [
					new MessageEmbed()
						.setColor('RED')
						.setDescription('<:X_:807305490160943104> There are no new messages to delete'),
				] }).then(msg => {setTimeout(function() { message.delete(); msg.delete(); }, 3000); });
			}
			message.channel.bulkDelete(notPinned, await message.reply({ embeds: [
				new MessageEmbed()
					.setColor('GREEN')
					.setDescription(`<:check:807305471282249738> ${fetched.size - 1} messages deleted${pinned.size == 0 ? ' ' : `\n\n️ℹ ${pinned.size} messages ignored`}`),
			] }).then(msg => {setTimeout(function() { msg.delete(); }, 3000); }), true);
		}
		catch (err) {
			await message.reply({ content: `I can't delete messages older than 2 weeks. Make sure the messages you are deleting are earlier that 2 weeks.\n \nSpecific error: \`${err}\``, reply: { messageReference: message.id } });
		}

	},
	/** @param {import("discord.js").CommandInteraction & { channel: import("discord.js").TextChannel }} interaction */
	async executeSlash(interaction) {
		// Can you convert the top function to slash_command?
		const amount = interaction.options.getInteger('number') ?? 100;

		if (amount <= 1 || amount > 100) {
			return await interaction.reply({ embeds: [
				new MessageEmbed()
					.setColor('RED')
					.setDescription('<:X_:807305490160943104> You need to input a number between 1 and 99.'),
			] });
		}
		await interaction.deferReply();
		const fetched = await interaction.channel.messages.fetch({ limit: amount });
		const notPinned = fetched.filter(fetchedMsg => !fetchedMsg.pinned);
		if ((fetched.size - 1) <= 0) {
			await interaction.editReply({ embeds: [
				new MessageEmbed()
					.setColor('RED')
					.setDescription('<:X_:807305490160943104> There are no new messages to delete'),
			] });
			await wait(3000);
			await interaction.deleteReply();
			return;
		}
		await interaction.channel.bulkDelete(notPinned);
		await interaction.editReply({ embeds: [
			new MessageEmbed()
				.setColor('GREEN')
				.setDescription(`<:check:807305471282249738> ${fetched.size - 1} messages deleted${notPinned.size == 0 ? ' ' : `\n\n️ℹ ${notPinned.size} messages ignored`}`),
		] });
		await wait(3000);
		await interaction.deleteReply();
	},
};