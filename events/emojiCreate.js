module.exports = async emoji => {
	const { MessageEmbed } = require('discord.js');
	const color = require('../color.json');
	const db = require('quick.db');
	var modLogChannel = db.get('loggingchannel_' + emoji.guild.id);
	var modLogChannel = emoji.guild.channels.cache.get(modLogChannel);

	if (!modLogChannel) return;

	const embed = new MessageEmbed()
		.setTitle('➕ Emoji Create')
		.setColor(color.bot_theme)
		.setDescription(emoji.animated ? `Name: <a:${emoji.name}:${emoji.id}> ${emoji.name}\nID: ${emoji.id}` : `Name: <:${emoji.name}:${emoji.id}> ${emoji.name}\nID: ${emoji.id}`)
		.addField('Emoji URL', emoji.url)
		.setFooter('COOL BOI BOT SERVER LOGGING')
		.setTimestamp();
		//modLogChannel.send({ embeds: [embed] }).catch(console.error);
	const webhooks = await modLogChannel.fetchWebhooks();
	const webhook = webhooks.first();

	await webhook.send({		
		username: 'COOL BOI BOT Logging',
		avatarURL: 'https://images-ext-1.discordapp.net/external/IRCkcws2ACaLh7lfNgQgZkwMtAPRQvML2XV1JNugLvM/https/cdn.discordapp.com/avatars/811024409863258172/699aa52d1dd597538fc33ceef502b1e6.png',
		embeds: [embed],
	});
;

};