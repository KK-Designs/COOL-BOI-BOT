module.exports = {
	name: 'dog',
	description: 'Sends a picture of a dog 🐶',
	usage: '(breed)',
	cooldown: 5,
	category: 'fun',
	execute(message, args) {
		const fetch = require('node-fetch');
		const sendError = require('../../error.js');
		const color = require('../../color.json');
		const { MessageEmbed } = require('discord.js');
		const { bold } = require('@discordjs/builders');
		if (!args[0]) {
			fetch('https://api.thedogapi.com/v1/images/search')
				.then((res) => res.json())
				.then((res) => {
					const embed = new MessageEmbed()
						.setColor(color.random)
						.setTitle('Dog 🐶')
						.addFields(
							{
								name: 'Name',
								value: `${
									res[0].breeds[0]?.name
										? res[0].breeds[0].name
										: 'Name not availible'
								}`,
							},
							{
								name: 'Height',
								value: `${
									res[0].breeds[0]?.height.imperial
										? res[0].breeds[0].name
										: 'Name not availible'
								} (US)`,
							},
							{
								name: 'Weight',
								value: `${
									res[0].breeds[0]?.weight.imperial
										? res[0].breeds[0].name
										: 'Name not availible'
								} (US)`,
							},
							{
								name: 'Temperament',
								value: `${
									res[0].breeds[0]?.temperament
										? res[0].breeds[0].name
										: 'Name not availible'
								}`,
							},
							{
								name: 'Lifespan',
								value: `${
									res[0].breeds[0]?.life_span
										? res[0].breeds[0].name
										: 'Name not availible'
								}`,
							},
						)
						.setImage(
							`https://cdn2.thedogapi.com/images/${
								res[0].breeds[0].reference_image_id
									? res[0].breeds[0].reference_image_id
									: 'Name not availible'
							}.jpg`,
						)
						.setTimestamp()
						.setFooter(
							'Powered by https://thedogapi.com',
							'https://www.thedogapi.com/favicon.ico',
						);
					message.reply({ embeds: [embed] });
				});
		}
		else {
			fetch(
				`https://api.thedogapi.com/v1/breeds/search?q=${encodeURIComponent(
					args.join(' '),
				)}`,
			)
				.then((res) => res.json())
				.then((res) => {
					if (!res.length) {
						return sendError(
							'I couldn\'t find any dog! Please try and enter a valid search and try again',
							message.channel,
						);
					}
					const embed = new MessageEmbed()
						.setColor(color.random)
						.setTitle('Dog 🐶')
						.addFields(
							{
								name: 'Name',
								value: `${res[0]?.name ? res[0].name : 'Name not availible'}`,
							},
							{
								name: 'Height',
								value: `${
									res[0]?.height.imperial
										? res[0].height.imperial
										: 'Height not availible'
								} (US)`,
							},
							{
								name: 'Weight',
								value: `${
									res[0]?.weight.imperial
										? res[0].weight.imperial
										: 'Weight not availible'
								} (US)`,
							},
							{
								name: 'Temperament',
								value: `${
									res[0]?.temperament
										? res[0].temperament
										: 'Temperament not availible'
								} (US)`,
							},
							{
								name: 'Lifespan',
								value: `${
									res[0]?.life_span
										? res[0].life_span
										: 'Lifespan not availible'
								}`,
							},
						)
						.setImage(
							`https://cdn2.thedogapi.com/images/${
								res[0]?.reference_image_id
									? res[0].breeds[0].name
									: 'Name not availible'
							}.jpg`,
						)
						.setTimestamp()
						.setFooter(
							'Powered by https://thedogapi.com',
							'https://www.thedogapi.com/favicon.ico',
						);
					message.reply({ embeds: [embed] });
				});
		}
	},
};
