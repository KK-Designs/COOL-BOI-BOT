module.exports = async message => {
	const { getLogChannel } = require('../utils.js');
	const { MessageEmbed } = require('discord.js');
	const color = require('../color.json');
	if (message.partial) return;
	if (message.first().channel.name == 'server-logs') return;
	const messageChannel = message.first().channel.name;
	const db = require('quick.db');

	if (getLogChannel(message.first().guild, db)) {
		const messageArray = [...message.values()];
		messageArray.slice(10, messageArray.length); // Slice removes all ements from the first number to the second number in an array. We use this to cut off the length of the array
		let stringedArray = messageArray.join('\n'); // We join the array using \n to separate the lines
		if (stringedArray.length > 2048) {
			stringedArray.slice(2048, stringedArray.length);
			stringedArray += '...';
		}
		const embed = new MessageEmbed()
			.setColor(color.bot_theme)
			.setAuthor(`Messages Purged in #${messageChannel}`)
			.setTitle(`Message Bulk delete by ${message.first().author.tag} deleted ${message.size - 1} messages`)
			.setDescription(`${stringedArray}`)
			.setFooter('COOL BOI BOT MESSAGE LOGGING')
			.setTimestamp();

		const webhooks = await getLogChannel(message.first().guild, db).fetchWebhooks();
		const webhook = webhooks.first();

		await webhook.send({
			username: 'COOL BOI BOT Logging',
			avatarURL: 'https://images-ext-1.discordapp.net/external/IRCkcws2ACaLh7lfNgQgZkwMtAPRQvML2XV1JNugLvM/https/cdn.discordapp.com/avatars/811024409863258172/699aa52d1dd597538fc33ceef502b1e6.png',
			embeds: [embed],
		});
	}

};