const axios = require('axios');
const fetch = require('node-fetch').default;
const { MessageEmbed } = require('discord.js');
const sendError = require('../../error.js');
const color = require('../../color.json');
module.exports = {
	name: 'weather',
	description: 'Gives the weather for the specified location  🌤️',
	usage: '[location]',
	cooldown: 5,
	category: 'general',
	clientPermissons: 'EMBED_LINKS',
	options: {
		city: {
			type: 'String',
			description: 'The name of the city',
		},
	},
	async execute(message, args) {
		axios
			.get(
				`https://api.openweathermap.org/data/2.5/weather?q=${args}&units=imperial&appid=c1ba87d2a335656425a17e4395303046`,
			)
			.then(response => {
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
				message.reply({ embeds: [exampleEmbed(currentTemp, maxTemp, minTemp, pressure, humidity, wind, cloudness, icon, author, profile, cityName, country, message)] });
			}).catch(err => {
				sendError('Enter a vailid city name', message.channel);
			});
	},
	async executeSlash(interaction) {
		const url = new URL('/data/2.5/weather', 'https://api.openweathermap.org');
		const city = interaction.options.getString('city', true);

		url.searchParams.set('q', city);
		url.searchParams.set('units', 'imperial');
		url.searchParams.set('appid', 'c1ba87d2a335656425a17e4395303046');
		const res = await fetch(url);

		if (!res.ok) {return interaction.reply(`HTTP Error ${res.status}: ${res.statusText}`);}

		const body = await res.json();
		const currentTemp = Math.ceil(body.main.temp);
		const maxTemp = body.main.temp_max;
		const minTemp = body.main.temp_min;
		const humidity = body.main.humidity;
		const wind = body.wind.speed;
		const author = interaction.user.username;
		const profile = interaction.user.displayAvatarURL;
		const icon = body.weather[0].icon;
		const cityName = city;
		const country = body.sys.country;
		const pressure = body.main.pressure;
		const cloudness = body.weather[0].description;
		const embed = exampleEmbed(currentTemp, maxTemp, minTemp, pressure, humidity, wind, cloudness, icon, author, profile, cityName, country, interaction);

		await interaction.reply({ embeds: [embed] });
	},
};
function exampleEmbed(
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
	message,
) {
	return new MessageEmbed()
		.setColor(message.guild?.me.displayHexColor ?? color.discord)
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
}