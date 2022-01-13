const fetch = require('node-fetch');
const sendError = require('../../error.js');
const color = require('../../color.json');
const { MessageEmbed } = require('discord.js');
let URL;
module.exports = {
	name: 'dog',
	description: 'Sends a picture of a dog 🐶',
	usage: '(breed)',
	cooldown: 5,
	category: 'fun',
	options: {
		breed: {
			type: 'String',
			description: 'The name of the breed you want to see',
			required: false,
		},
	},
	async execute(message, args) {
		if (!args[0]) {
			fetch('https://api.thedogapi.com/v1/images/search').then(res => res.json()).then(res => {
				const embed = new MessageEmbed()
					.setColor(color.random)
					.setTitle('Dog 🐶')
					.addFields(
						{ name: 'Name', value: `${res[0].breeds[0]?.name ? res[0].breeds[0].name : 'Name not availible'}` },
						{ name: 'Height', value: `${res[0].breeds[0]?.height.imperial ? res[0].breeds[0].name : 'Name not availible'} (US)` },
						{ name: 'Weight', value: `${res[0].breeds[0]?.weight.imperial ? res[0].breeds[0].name : 'Name not availible'} (US)` },
						{ name: 'Temperament', value: `${res[0].breeds[0]?.temperament ? res[0].breeds[0].name : 'Name not availible'}` },
						{ name: 'Lifespan', value: `${res[0].breeds[0]?.life_span ? res[0].breeds[0].name : 'Name not availible'}` },
					)
					.setImage(`https://cdn2.thedogapi.com/images/${res[0].breeds[0].reference_image_id ? res[0].breeds[0].reference_image_id : 'Name not availible'}.jpg`)
					.setTimestamp()
					.setFooter({ text: 'Powered by https://thedogapi.com', iconURL: 'https://www.thedogapi.com/favicon.ico' });
				message.reply({ embeds: [ embed ] });
			});
		} else {
			fetch(`https://api.thedogapi.com/v1/breeds/search?q=${encodeURIComponent(args.join(' '))}`).then(res => res.json()).then(res => {
				if (!res.length) {
					return sendError('I couldn\'t find any dog! Please try and enter a valid search and try again', message.channel);
				}
				if (!res[0]?.reference_image_id) {
					URL = 'https://cdn2.iconfinder.com/data/icons/documents-and-files-v-2/100/doc-03-512.png';
				} else {
					URL = 'https://cdn2.thedogapi.com/images/' + res[0].reference_image_id + '.jpg';
				}
				const embed = new MessageEmbed()
					.setColor(color.random)
					.setTitle('Dog 🐶')
					.addFields(
						{ name: 'Name', value: `${res[0]?.name ? res[0].name : 'Name not availible'}` },
						{ name: 'Height', value: `${res[0]?.height.imperial ? res[0].height.imperial : 'Height not availible'} (US)` },
						{ name: 'Weight', value: `${res[0]?.weight.imperial ? res[0].weight.imperial : 'Weight not availible'} (US)` },
						{ name: 'Temperament', value: `${res[0]?.temperament ? res[0].temperament : 'Temperament not availible'} (US)` },
						{ name: 'Lifespan', value: `${res[0]?.life_span ? res[0].life_span : 'Lifespan not availible'}` },
					)
					.setImage(URL)
					.setTimestamp()
					.setFooter({ text: 'Powered by https://thedogapi.com', iconURL: 'https://www.thedogapi.com/favicon.ico' });
				message.reply({ embeds: [ embed ] });
			});
		}
	},
	async executeSlash(interaction) {
		const wait = require('util').promisify(setTimeout);
		await interaction.deferReply();
		await wait(1);
		const breed = interaction.options.getString('breed');
		if (!breed) {
			fetch('https://api.thedogapi.com/v1/images/search').then(res => res.json()).then(res => {
				const embed = new MessageEmbed()
					.setColor(color.random)
					.setTitle('Dog 🐶')
					.addFields(
						{ name: 'Name', value: `${res[0].breeds[0]?.name ? res[0].breeds[0].name : 'Name not availible'}` },
						{ name: 'Height', value: `${res[0].breeds[0]?.height.imperial ? res[0].breeds[0].name : 'Name not availible'} (US)` },
						{ name: 'Weight', value: `${res[0].breeds[0]?.weight.imperial ? res[0].breeds[0].name : 'Name not availible'} (US)` },
						{ name: 'Temperament', value: `${res[0].breeds[0]?.temperament ? res[0].breeds[0].name : 'Name not availible'}` },
						{ name: 'Lifespan', value: `${res[0].breeds[0]?.life_span ? res[0].breeds[0].name : 'Name not availible'}` },
					)
					.setImage(`https://cdn2.thedogapi.com/images/${res[0].breeds[0]?.reference_image_id == undefined ? 'https://cdn2.iconfinder.com/data/icons/documents-and-files-v-2/100/doc-03-512' : res[0].breeds[0].reference_image_id}.jpg`)
					.setTimestamp()
					.setFooter({ text: 'Powered by https://thedogapi.com', iconURL: 'https://www.thedogapi.com/favicon.ico' });
				interaction.editReply({ embeds: [ embed ] });
			});
		} else {
			fetch(`https://api.thedogapi.com/v1/breeds/search?q=${encodeURIComponent(breed)}`).then(res => res.json()).then(res => {
				if (!res.length) {
					return sendError('I couldn\'t find any dog! Please try and enter a valid search and try again', interaction.channel);
				}
				if (!res[0]?.reference_image_id) {
					URL = 'https://cdn2.iconfinder.com/data/icons/documents-and-files-v-2/100/doc-03-512.png';
				} else {
					URL = 'https://cdn2.thedogapi.com/images/' + res[0].reference_image_id + '.jpg';
				}
				const embed = new MessageEmbed()
					.setColor(color.random)
					.setTitle('Dog 🐶')
					.addFields(
						{ name: 'Name', value: `${res[0]?.name ? res[0].name : 'Name not availible'}` },
						{ name: 'Height', value: `${res[0]?.height.imperial ? res[0].height.imperial : 'Height not availible'} (US)` },
						{ name: 'Weight', value: `${res[0]?.weight.imperial ? res[0].weight.imperial : 'Weight not availible'} (US)` },
						{ name: 'Temperament', value: `${res[0]?.temperament ? res[0].temperament : 'Temperament not availible'} (US)` },
						{ name: 'Lifespan', value: `${res[0]?.life_span ? res[0].life_span : 'Lifespan not availible'}` },
					)
					.setImage(URL)
					.setTimestamp()
					.setFooter({ text: 'Powered by https://thedogapi.com', iconURL: 'https://www.thedogapi.com/favicon.ico' });
				interaction.editReply({ embeds: [ embed ] });
			});
		}
	},
};