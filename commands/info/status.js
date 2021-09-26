const { MessageEmbed, version } = require('discord.js');
const cpuu = require('cputilization');
const color = require('../../color.json');
module.exports = {
	name: 'status',
	description: 'Gets the bots status!',
	cooldown: 3,
	clientPermissons: 'EMBED_LINKS',
	category: 'info',
	options: {},
	async execute(message, args, client) {

		const days = Math.floor(client.uptime / 86400000);
		const hours = Math.floor(client.uptime / 3600000) % 24;
		const minutes = Math.floor(client.uptime / 60000) % 60;
		const seconds = Math.floor(client.uptime / 1000) % 60;
		cpuu((error, sample) => {
			// returns after 1000ms with the cpu usage of that time interval


			// const duration = moment.duration(client.uptime).format(` D ${days}, H ${hrs}, m ${mins}, s ${secs}`);
			const uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
			const statusembed = new MessageEmbed()
				.setTitle('<:CoolEpicface:740705001298460763> COOL BOT BOT Status <:CoolEpicface:740705001298460763>')
				.addField('Hosted:', 'Yes')
				.addField('Mem Usage:', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`)
				.addField('CPU (%):', `${Math.round(sample.percentageBusy() * 100)}%`)
				.addField('Uptime', `${uptime}`)
				.addField('Guilds', `${client.guilds.cache.size}`)
				.addField('Total Users', `${client.users.cache.size}`)
				.addField('Total Commands', `${client.commands.size}`)
				.addField('More Statistics', '[Click here](https://stats.uptimerobot.com/n81XLfGOEv/786433082 "See bot status on the web")')
				.setFooter(`© COOL BOI BOT 2021 | v${version}`, client.user.displayAvatarURL({ dynamic: true }))
				.setTimestamp()
				.setColor(message.guild?.me.displayHexColor ?? color.discord);

			message.reply({ embeds: [statusembed] });
		});
	},
	async executeSlash(interaction, client) {
		const days = Math.floor(client.uptime / 86400000);
		const hours = Math.floor(client.uptime / 3600000) % 24;
		const minutes = Math.floor(client.uptime / 60000) % 60;
		const seconds = Math.floor(client.uptime / 1000) % 60;
		const sample = await new Promise((res, rej) => cpuu((err, data) => (err ? rej(err) : res(data))));
		// returns after 1000ms with the cpu usage of that time interval
		// const duration = moment.duration(client.uptime).format(` D ${days}, H ${hrs}, m ${mins}, s ${secs}`);
		const uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
		const statusembed = new MessageEmbed()
			.setTitle('<:CoolEpicface:740705001298460763> COOL BOT BOT Status <:CoolEpicface:740705001298460763>')
			.addField('Hosted:', 'Yes')
			.addField('Mem Usage:', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`)
			.addField('CPU (%):', `${Math.round(sample.percentageBusy() * 100)}%`)
			.addField('Uptime', `${uptime}`)
			.addField('Guilds', `${client.guilds.cache.size}`)
			.addField('Total Users', `${client.users.cache.size}`)
			.addField('Total Commands', `${client.commands.size}`)
			.addField('More Statistics', '[Click here](https://stats.uptimerobot.com/n81XLfGOEv/786433082 "See bot status on the web")')
			.setFooter(`© COOL BOI BOT 2021 | v${version}`, client.user.displayAvatarURL({ dynamic: true }))
			.setTimestamp()
			.setColor(interaction.guild?.me.displayHexColor ?? color.discord);

		await interaction.reply({ embeds: [statusembed] });
	},
};