module.exports = async (oldemoji, newemoji) => {
	const { MessageEmbed } = require('discord.js');
	const color = require('../color.json');
	const db = require('quick.db');
	var modLogChannel = db.get('loggingchannel_' + newemoji.guild.id);
	var modLogChannel = newemoji.guild.channels.cache.get(modLogChannel);

	if (!modLogChannel) return;

	const embed = new MessageEmbed() // Create embed
		.setTitle('📝 Emoji Update') // Set embed title
		.setColor(color.bot_theme) // Set color in HEX
		.setDescription(newemoji.animated == true ? `New Name: <a:${newemoji.name}:${newemoji.id}> ${newemoji.name}\n \nOld Name: ${oldemoji.name}\n \nID: ${newemoji.id}` : `New Name: <:${newemoji.name}:${newemoji.id}> ${newemoji.name}\n \nOld Name: ${oldemoji.name}\n \nID: ${newemoji.id}`)
		.addField('New Emoji URL', newemoji.url)
		.addField('Old Emoji URL', oldemoji.url)
		.setFooter('COOL BOI BOT SERVER LOGGING')
		.setTimestamp();

	modLogChannel.send({ embeds: [embed] });

};