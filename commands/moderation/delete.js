const { TextChannel, CommandInteraction } = require('discord.js');
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
		const amount = args[0] ? parseInt(args[0]) + 1 : 100;

		try {
			if (isNaN(amount)) {
				return message.reply({ content: 'that doesn\'t seem to be a valid number.' });
			}
			else if (amount <= 1 || amount > 100) {
				return message.reply({ content: 'you need to input a number between 1 and 99.' });
			}
			await message.channel.bulkDelete(amount, true);
		}
		catch (err) {
			await message.reply({ content: `I can\'t delete messages older than 2 weeks. Make sure the messages you are deleting are earlier that 2 weeks.\n \nSpecific error: ${err}` });
		}
		await message.channel.send({ content: `${amount - 1} messages deleted` }).then(msg => msg.delete({ timeout: 3000 }));
	},
	/** @param {CommandInteraction & { channel: TextChannel }} interaction */
	async executeSlash(interaction) {
		const amount = interaction.options.getInteger('number') ?? 100;

		if (amount <= 1 || amount > 100) {
			return await interaction.reply({ content: 'you need to input a number between 1 and 99.' });
		}
		await interaction.deferReply({ ephemeral: true });
		await interaction.channel.bulkDelete(amount, true);
		await interaction.editReply({ content: `${amount - 1} messages deleted` });
	},
};