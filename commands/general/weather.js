module.exports = {
	name: 'weather',
	description: 'Gives the weather for the specified location  🌤️',
	usage: '[location]',
	cooldown: 5,
	category: 'general',
	clientPermissons: 'EMBED_LINKS',
	async execute(message, args) {
		require('dotenv').config();
		const axios = require('axios');
		const { MessageEmbed } = require('discord.js');
		const sendError = require('../../error.js');
		const exampleEmbed = (
			temp,
			maxTemp,
			minTemp,
			pressure,
			humidity,
			wind,
			cloudness,
			icon,
			author,
			profile,
			cityName,
			country,
		) =>
			new MessageEmbed()
				.setColor(
					message.channel.type === 'dm'
						? color.discord
						: message.guild.me.displayHexColor,
				)
				.setAuthor(`Hello, ${author}`, profile)
				.setTitle(`${temp}\u00B0 F in ${cityName}, ${country}`)
				.addField('Maximum Temperature:', `${maxTemp}\u00B0 F`, true)
				.addField('Minimum Temperature:', `${minTemp}\u00B0 F`, true)
				.addField('Humidity:', `${humidity} %`, true)
				.addField('Wind Speed:', `${wind} mph`, true)
				.addField('Pressure:', `${pressure} hpa`, true)
				.addField('Cloudiness:', `${cloudness}`, true)
				.setThumbnail(`http://openweathermap.org/img/w/${icon}.png`)
				.setFooter('Powered by the COOL BOI BOT');

		axios
			.get(
				`https://api.openweathermap.org/data/2.5/weather?q=${args}&units=imperial&appid=${process.env.WEATHER_API}`,
			)
			.then((response) => {
				const apiData = response;
				const currentTemp = Math.ceil(apiData.data.main.temp);
				const maxTemp = apiData.data.main.temp_max;
				const minTemp = apiData.data.main.temp_min;
				const humidity = apiData.data.main.humidity;
				const wind = apiData.data.wind.speed;
				const author = message.author.username;
				const profile = message.author.displayAvatarURL;
				const icon = apiData.data.weather[0].icon;
				const cityName = args;
				const country = apiData.data.sys.country;
				const pressure = apiData.data.main.pressure;
				const cloudness = apiData.data.weather[0].description;
				message.channel.send({
					embeds: [
						exampleEmbed(
							currentTemp,
							maxTemp,
							minTemp,
							pressure,
							humidity,
							wind,
							cloudness,
							icon,
							author,
							profile,
							cityName,
							country,
						),
					],
					reply: { messageReference: message.id },
				});
			})
			.catch((err) => {
				sendError('Enter a vailid city name', message.channel);
			});
	},
};
