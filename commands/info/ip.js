module.exports = {
	name: 'ip',
	description: 'Get your ip\'s info. YOU INFORMATION OR IP IS NEVER DISTRIBUTED ANYWHERE.  YOUR THINGS ARE SAFE',
	cooldown: 3,
	usage: '[your ip]',
	category: 'info',
	execute(message, args, client) {
		const fetch = require('node-fetch');

		if (!args.length) return message.channel.send({ content: 'I need your IPv4 to get your info', reply: { messageReference: message.id } });

		if (message.guild) {
			message.delete();
			return message.channel.send({ content: 'if you want to expose you ip to everyone here do this in a dm with me 🙂', reply: { messageReference: message.id } });
		}

		const res = fetch(`https://ipinfo.io/${args[0]}/geo`)
			.then((res) => res.json())
			.then((data) => {
				const ip = data.ip;
				const city = data.city;
				const region = data.region;
				const country = data.country;
				const location = data.loc;
				const postal = data.postal;
				const timezone = data.timezone;

				if (ip == undefined) {
					return message.channel.send({ content: 'Please provide a valid IP address', reply: { messageReference: message.id } });
				}

				const user = message.author;
				const color = require('../../color.json');
				const { MessageEmbed } = require('discord.js');
				const embed = new MessageEmbed()
					.setColor(color.bot_theme)
					.setTitle(`IP info for \`${ip}\``)
					.addField('IP:', ip)
					.addField('City:', city)
					.addField('Region:', region)
					.addField('Country:', country)
					.addField('Location:', location)
					.addField('Postal code:', postal)
					.addField('Timezone:', timezone)
					.setFooter(user.username, user.displayAvatarURL({ dynamic: true }))
					.setTimestamp();
				message.channel.send({ embeds: [embed], reply: { messageReference: message.id } });

			});
	},
};