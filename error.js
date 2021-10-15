const { MessageEmbed } = require('discord.js');
const { inlineCode } = require('@discordjs/builders');
const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);
module.exports = async (text, channel) => {
	const embed = new MessageEmbed()
		.setColor('RED')
		.setTitle('<:error_x:815780013256343582> Error: ')
		.setDescription(inlineCode(trim(text, 4096)))
		.setFooter(channel.client.user.username, channel.client.user.displayAvatarURL({ dynamic: true }));

	await channel.send({ embeds: [embed] });
};