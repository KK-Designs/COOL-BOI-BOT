module.exports = {
	name: 'dictionary',
	description: 'Lookup any word on the dictionary 📖 Powered by OwlBot 🦉',
	aliases: ['define'],
	cooldown: 10,
	usage: '[message]',
	clientPermissons: 'EMBED_LINKS',
	category: 'general',
	execute(message, args) {
		const { MessageEmbed } = require('discord.js');
		const prefix = require('discord-prefix');
		const guildPrefix = prefix.getPrefix(message.channel.type === 'dm' ? message.author.id : message.guild.id);
		const Owlbot = require('owlbot-js');
		const client = Owlbot('90ff8fb2e0b4a5149df34b606a9ce04e47eaec5d');
		if (!args[0]) {
			return message.channel.send({ content: 'Please provide a word for me to define!', reply: { messageReference: message.id } });
		}
		client.define(args[0]).then(function(result) {
			if (!result.word) {
				return message.channel.send({ content: `Could not find definitions for "${args[0]}". Try using the \`${guildPrefix}urban\` command for slangs.`, reply: { messageReference: message.id } });
			}
			const embed = new MessageEmbed()
				.setTitle(`Definition for "${result.word}"`)
				.addField('Definition: ', result.definitions[0].definition || 'Not avavible')
				.addField('Example: ', result.definitions[0].example || 'Not avavible')
				.addField('Type: ', result.definitions[0].type || 'Not avavible')
				.addField('Pronunciation: ', result.pronunciation || 'Not avavible')
				.setFooter('Powered by OwlBot')
				.setTimestamp()
				.setColor(message.channel.type === 'GUILD_TEXT' ? message.member.displayHexColor : '#FFB700');
			message.channel.send({ embeds: [ embed ], reply: { messageReference: message.id } });
		});
	},
};