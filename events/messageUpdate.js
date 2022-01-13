module.exports = async (message, messageNew) => {
	const { getLogChannel } = require('../utils.js');
	const {
		MessageEmbed,
		MessageActionRow,
		MessageButton,
	} = require('discord.js');
	const color = require('../color.json');
	const db = require('quick.db');

	if (message.partial) {
		message
			.fetch()
			.then(async (fullMessage) => {
				if (fullMessage.author.bot) return;
				if (!getLogChannel(fullMessage.guild, db)) return;
				const jumpToMsg = new MessageActionRow().addComponents(
					new MessageButton()
						.setURL(
							`https://discord.com/channels/${fullMessage.guild.id}/${fullMessage.channel.id}/${fullMessage.id}`,
						)
						.setLabel('Jump to message')
						.setEmoji('⬆️')
						.setStyle('LINK'),
				);
				const embed = new MessageEmbed()
					.setAuthor('📝 Message updated')
					.setColor(color.bot_theme)
					.setDescription(
						`${fullMessage.author} edited a message in ${fullMessage.channel}`,
					)
					.setFooter('COOL BOI BOT MESSAGE LOGGING')
					.setTimestamp();

				const webhooks = await getLogChannel(
					fullMessage.guild,
					db,
				).fetchWebhooks();
				const webhook = webhooks.first();

				await webhook.send({
					username: 'COOL BOI BOT Logging',
					avatarURL:
						'https://cdn.discordapp.com/avatars/811024409863258172/f67bc2b8f122599864b02156cd67564b.png',
					embeds: [embed],
					components: [jumpToMsg],
				});
			})
			.catch((error) => {
				console.log('Something went wrong when fetching the message: ', error);
			});
	}
	else {
		if (message.content === messageNew.content) return;
		if (message.author.bot) return;

		if (!getLogChannel(message.guild, db)) return;
		const jumpToMsg = new MessageActionRow().addComponents(
			new MessageButton()
				.setURL(
					`https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`,
				)
				.setLabel('Jump to message')
				.setEmoji('⬆️')
				.setStyle('LINK'),
		);
		const embed = new MessageEmbed()
			.setAuthor('📝 Message updated')
			.setColor(color.bot_theme)
			.setDescription(
				`${message.author} edited a message in ${message.channel}`,
			)
			.addField('Old message:', `${message}`, true)
			.addField('New message:', `${messageNew}`, true)
			.setFooter('COOL BOI BOT MESSAGE LOGGING')
			.setTimestamp();

		const webhooks = await getLogChannel(message.guild, db).fetchWebhooks();
		const webhook = webhooks.first();

		await webhook.send({
			username: 'COOL BOI BOT Logging',
			avatarURL:
				'https://cdn.discordapp.com/avatars/811024409863258172/f67bc2b8f122599864b02156cd67564b.png',
			embeds: [embed],
			components: [jumpToMsg],
		});
	}
};
