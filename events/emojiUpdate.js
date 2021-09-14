module.exports = async (oldemoji, newemoji) => {
	const { getLogChannel } = require('../utils.js');
	const { MessageEmbed } = require('discord.js');
	const color = require('../color.json');
	const db = require('quick.db');

	if (!getLogChannel(newemoji.guild, db)) return;

	const embed = new MessageEmbed() // Create embed
		.setTitle('📝 Emoji Update') // Set embed title
		.setColor(color.bot_theme) // Set color in HEX
		.setDescription(newemoji.animated == true ? `New Name: <a:${newemoji.name}:${newemoji.id}> ${newemoji.name}\n \nOld Name: ${oldemoji.name}\n \nID: ${newemoji.id}` : `New Name: <:${newemoji.name}:${newemoji.id}> ${newemoji.name}\n \nOld Name: ${oldemoji.name}\n \nID: ${newemoji.id}`)
		.addField('New Emoji URL', newemoji.url)
		.addField('Old Emoji URL', oldemoji.url)
		.setFooter('COOL BOI BOT SERVER LOGGING')
		.setTimestamp();

		//modLogChannel.send({ embeds: [embed] }).catch(console.error);
	const webhooks = await getLogChannel(newemoji.guild, db).fetchWebhooks();
	const webhook = webhooks.first();

	await webhook.send({		
		username: 'COOL BOI BOT Logging',
		avatarURL: 'https://images-ext-1.discordapp.net/external/IRCkcws2ACaLh7lfNgQgZkwMtAPRQvML2XV1JNugLvM/https/cdn.discordapp.com/avatars/811024409863258172/699aa52d1dd597538fc33ceef502b1e6.png',
		embeds: [embed],
	});
;

};