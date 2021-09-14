module.exports = async (message, messageNew) => {	
	const { getLogChannel } = require('../utils.js');
	const { MessageEmbed } = require('discord.js');
	const color = require('../color.json');
	const db = require('quick.db');
	if (message.partial) return;
	if (message.content === messageNew.content) return;
	if (message.author.bot) return;

	if (!getLogChannel(message.guild, db)) return;
	const embed = new MessageEmbed()
		.setAuthor('📝 Message updated')
		.setColor(color.bot_theme)
		.setDescription(`${message.author} edited a message in ${message.channel}`)
		.addField('Old message:', `${message}`, true)
		.addField('New message:', `${messageNew}`, true)
		.setFooter('COOL BOI BOT MESSAGE LOGGING')
		.setTimestamp();

	//modLogChannel.send({ embeds: [embed] }).catch();
	const webhooks = await getLogChannel(message.guild, db).fetchWebhooks();
	const webhook = webhooks.first();

	await webhook.send({		
		username: 'COOL BOI BOT Logging',
		avatarURL: 'https://images-ext-1.discordapp.net/external/IRCkcws2ACaLh7lfNgQgZkwMtAPRQvML2XV1JNugLvM/https/cdn.discordapp.com/avatars/811024409863258172/699aa52d1dd597538fc33ceef502b1e6.png',
		embeds: [embed],
	});
};