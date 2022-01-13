const { MessageEmbed } = require('discord.js');
const { fail } = require('../../color.json');
const Owlbot = require('owlbot-js');
const client = Owlbot('90ff8fb2e0b4a5149df34b606a9ce04e47eaec5d');
module.exports = {
	name: 'dictionary',
	description: 'Lookup any word on the dictionary 📖 Powered by OwlBot 🦉',
	aliases: ['define'],
	cooldown: 10,
	usage: '[message]',
	clientPermissons: 'EMBED_LINKS',
	category: 'general',
	options: {
		word: {
			type: 'String',
			description: 'The word to check',
		},
	},
	async execute(message, args) {
		const word = args.join(' ');
		if (!word) {
			return message.reply({ content: 'Please provide a word for me to define!' });
		}
		const result = await client.define(word).catch(() => null);
		const ErrorEmbed = new MessageEmbed()
			.setDescription(`The word, "${word}" is not in our dictionary. Please make sure there's no spelling errors`)
			.setColor(fail);
		if (!result?.definitions) {
			return await message.reply({ embeds: [ ErrorEmbed ] });
		}
		const findingEmbed = new MessageEmbed()
			.setTitle(`<a:loading:808390866367545384> Searching ${word} amoungst 800000 words`)
			.setColor(message.channel.type === 'GUILD_TEXT' ? message.member.displayHexColor : '#FFB700');
		message.reply({ embeds: [ findingEmbed ] }).then(msg => {
			setTimeout(() => {
				msg.edit({ embeds: [embed] });
			}, 1000);
		});
		const embed = new MessageEmbed()
			.setTitle(`Definition for "${result.word}"`)
			.addField('Definition: ', result.definitions[0].definition || 'Not avavible')
			.addField('Example: ', result.definitions[0].example || 'Not avavible')
			.addField('Type: ', result.definitions[0].type || 'Not avavible')
			.addField('Pronunciation: ', result.pronunciation || 'Not avavible')
			.setFooter({ text: 'Powered by OwlBot' })
			.setTimestamp()
			.setColor(message.channel.type === 'GUILD_TEXT' ? message.member.displayHexColor : '#FFB700');
	},
	async executeSlash(interaction) {
		const word = interaction.options.getString('word', true);
		const result = await client.define(word).catch(() => null);
		const ErrorEmbed = new MessageEmbed()
			.setDescription(`The word, "${word}" is not in our dictionary. Please make sure there's no spelling errors`)
			.setColor(fail);
		if (!result?.definitions) {
			return await interaction.reply({
				embeds: [ ErrorEmbed ],
			});
		}
		const embed = new MessageEmbed()
			.setTitle(`Definition for "${result.word}"`)
			.addField('Definition: ', result.definitions[0].definition || 'Not avavible')
			.addField('Example: ', result.definitions[0].example || 'Not avavible')
			.addField('Type: ', result.definitions[0].type || 'Not avavible')
			.addField('Pronunciation: ', result.pronunciation || 'Not avavible')
			.setFooter({ text: 'Powered by OwlBot' })
			.setTimestamp()
			.setColor(interaction.member?.displayHexColor ?? '#FFB700');

		await interaction.reply({ embeds: [embed] });
	},
};