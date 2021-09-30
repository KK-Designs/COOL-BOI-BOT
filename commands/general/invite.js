module.exports = {
	name: 'invite',
	description: 'Gets the bot invite link!',
	cooldown: 3,
	category: 'general',
	options: {},
	async execute(message) {
		const { MessageActionRow, MessageButton } = require('discord.js');
		const buttonInvite = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setURL(`https://discord.com/api/oauth2/authorize?client_id=${message.client.user.id}&permissions=4294442967&scope=bot%20applications.commands`)
					.setLabel('Invite bot')
					.setEmoji('<:join:812013459298058260>')
					.setStyle('LINK'),
			);
		const buttonInviteADMIN = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setURL(`https://discord.com/api/oauth2/authorize?client_id=${message.client.user.id}&permissions=8&scope=bot%20applications.commands`)
					.setLabel('Invite bot [ADMIN PERMS]')
					.setEmoji('<:join:812013459298058260>')
					.setStyle('LINK'),
			);
		message.reply({ content: 'To invite the bot, please click one the buttons below (admin link recommened)', components: [ buttonInvite, buttonInviteADMIN ] });
	},
	async executeSlash(interaction, client) {
		const { MessageActionRow, MessageButton } = require('discord.js');
		const buttonInvite = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=4294442967&scope=bot%20applications.commands`)
					.setLabel('Invite bot')
					.setEmoji('<:join:812013459298058260>')
					.setStyle('LINK'),
			);
		const buttonInviteADMIN = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
					.setLabel('Invite bot [ADMIN PERMS]')
					.setEmoji('<:join:812013459298058260>')
					.setStyle('LINK'),
			);
		await interaction.reply({ content: 'To invite the bot, please click one the buttons below (admin link recommened)', components: [ buttonInvite, buttonInviteADMIN ] });
	},
};