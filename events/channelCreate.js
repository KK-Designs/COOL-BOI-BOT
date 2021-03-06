module.exports = async channel => {
	const { getLogChannel } = require('../utils.js');
	const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
	const color = require('../color.json');
	const db = require('quick.db');
	if (channel.type == 'DM') return;

	if (getLogChannel(channel.guild, db)) {

		if (!getLogChannel(channel.guild, db).permissionsFor(channel.guild.me).has('VIEW_CHANNEL')) return;
		if (!getLogChannel(channel.guild, db).permissionsFor(channel.guild.me).has('SEND_MESSAGES')) return;
		const jumpToChannel = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setURL(`https://discord.com/channels/${channel.guild.id}/${channel.id}`)
					.setLabel('Go to channel')
					.setEmoji('⬆️')
					.setStyle('LINK'),
			);
		const embed = new MessageEmbed()
			.setAuthor('🔨 Channel created')
			.setColor(color.success)
			.setDescription(`Created channel ${channel}`)
			.setFooter('COOL BOI BOT SERVER LOGGING')
			.setTimestamp();


		const webhooks = await getLogChannel(channel.guild, db).fetchWebhooks();
		const webhook = webhooks.first();

		await webhook.send({
			username: 'COOL BOI BOT Logging',
			avatarURL: 'https://images-ext-1.discordapp.net/external/IRCkcws2ACaLh7lfNgQgZkwMtAPRQvML2XV1JNugLvM/https/cdn.discordapp.com/avatars/811024409863258172/699aa52d1dd597538fc33ceef502b1e6.png',
			embeds: [embed],
			components: [jumpToChannel],
		});


	}

};