const { MessageEmbed } = require('discord.js');
const smartestchatbot = require('smartestchatbot');
const chatbot = new smartestchatbot.Client();
const sendError = require('../../error.js');
module.exports = {
	name: 'chatbot',
	description: 'Talk a AI controlled bot! 🤖',
	aliases: ['bot', 'ai'],
	cooldown: 3,
	category: 'fun',
	execute(message, args, client) {

		const query = args.join(' ');

		if (!args.length) {return sendError('I need a message to reply to!', message.channel);}

		chatbot.chat({ message: query, name: client.user.username, owner: 'NotBacon#4259', user: message.author.id, language: 'en' }).then(reply => {
			const embed = new MessageEmbed()
				.setAuthor(client.user.username, client.user.displayAvatarURL({ dymamic: true }))
				.setDescription(`${reply}`)
				.setFooter(message.author.username, message.author.displayAvatarURL({ dymamic: true }))
				.setTimestamp()
				.setColor(message.channel.type === 'GUILD_TEXT' ? message.guild.me.displayHexColor : '#FFB700');

			message.reply({ embeds: [embed] });
		});
	},
};