module.exports = {
	name: 'delete',
	description: 'Purges the spcified amount! If none spcified deletes the first 100 messages',
	guildOnly: true,
	aliases: ['purge', 'clear'],
	usage: '(number)',
	permissions: 'MANAGE_MESSAGES',
	clientPermissons: 'MANAGE_MESSAGES',
	cooldown: 3,
	category: 'moderation',
	async execute(message, args) {
		const { MessageEmbed } = require('discord.js');
		try {
			if (!args[0]) {
				const fetched = await message.channel.messages.fetch({ limit: 100 });
				if ((fetched.size - 1) == 0) {
					return message.reply({ embeds: [
						new MessageEmbed()
							.setColor('RED')
							.setDescription('<:X_:807305490160943104> There are no new messages to delete'),
					] }).then(msg => {setTimeout(function() { message.delete(); msg.delete(); }, 3000); });
				}
				return message.channel.bulkDelete(fetched, message.channel.send({ embeds: [
					new MessageEmbed()
						.setColor('GREEN')
						.setDescription(`<:check:807305471282249738> ${fetched.size - 1} messages deleted`),
				] }).then(msg => {setTimeout(function() { msg.delete(); }, 3000); }), true);
			}
			const amount = parseInt(args[0]) + 1;
			if (isNaN(amount)) {
				return message.channel.send({ embeds: [
					new MessageEmbed()
						.setColor('RED')
						.setDescription('<:X_:807305490160943104> That doesn\'t seem to be a valid number.'),
				], reply: { messageReference: message.id } });
			}
			else if (amount <= 1 || amount > 100) {
				return message.channel.send({ embeds: [
					new MessageEmbed()
						.setColor('RED')
						.setDescription('<:X_:807305490160943104> You need to input a number between 1 and 99.'),
				], reply: { messageReference: message.id } });
			}
			const fetched = await message.channel.messages.fetch({ limit: amount });
			if ((fetched.size - 1) == 0) {
				return message.reply({ embeds: [
					new MessageEmbed()
						.setColor('RED')
						.setDescription('<:X_:807305490160943104> There are no new messages to delete'),
				] }).then(msg => {setTimeout(function() { message.delete(); msg.delete(); }, 3000); });
			}
			message.channel.bulkDelete(amount, message.channel.send({ embeds: [
				new MessageEmbed()
					.setColor('GREEN')
					.setDescription(`<:check:807305471282249738> ${fetched.size - 1} messages deleted`),
			] }).then(msg => {setTimeout(function() { msg.delete(); }, 3000); }), true);
		}
		catch (err) {
			message.channel.send({ content: `I can\'t delete messages older than 2 weeks. Make sure the messages you are deleting are earlier that 2 weeks.\n \nSpecific error: \`${err}\``, reply: { messageReference: message.id } });
		}
	},
};