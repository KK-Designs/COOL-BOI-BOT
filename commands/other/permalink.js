/**
* @param {import("discord.js").Message} message
* @param {import("discord.js").Client} client
*/
module.exports = {
	name: 'permalink',
	guildOnly: true,
	description: 'Gives you a permanent link to the files you provide. 🔗',
	cooldown: 5,
	category: 'other',
	options: {},
	async execute(message) {
		const { MessageEmbed } = require('discord.js');
		if (message.attachments.first()) {
			const msg = await message.client.channels.fetch('891838175155208242');
			const m = await msg.channel.send(message.attachments.first().url);
			const embed = new MessageEmbed()
				.setTitle('Your image link:')
				.setURL(m.attachments.first().url)
				.addFields(
					{ name: 'Url', value: m.attachments.first().url, inline: true },
					{ name: 'Size', value: m.attachments.first().size, inline: true },
					{ name: 'Dimensions', value: `${m.attachments.first().width}x${m.attachments.first().height}`, inline: true },
				)
				.setColor(message.member?.displayHexColor ?? '#FFB700');
			await message.reply({ embeds: [ embed ] });
		}
	},
	async executeSlash(interaction) {
		await interaction.reply({ content: '<:X_:807305490160943104> Slash commands are not supported on this command' });
	},
};