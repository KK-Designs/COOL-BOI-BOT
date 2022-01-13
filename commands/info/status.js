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
	async execute(message) {
		const { client } = message;
		const days = Math.floor(client.uptime / 86400000);
		const hours = Math.floor(client.uptime / 3600000) % 24;
		const minutes = Math.floor(client.uptime / 60000) % 60;
		const seconds = Math.floor(client.uptime / 1000) % 60;
		const sample = await new Promise((res, rej) => cpuu((err, data) => err ? rej(err) : res(data)));
		// returns after 1000ms with the cpu usage of that time interval

		const uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
		const statusembed = new MessageEmbed()
			.setTitle(`<:CoolBoiBot:905151808186511361> ${message.client.user.username} Status <:CoolBoiBot:905151808186511361>`)
			.addField('Hosted:', 'Yes')
			.addField('Mem Usage:', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`)
			.addField('CPU (%):', `${Math.round(sample.percentageBusy() * 100)}%`)
			.addField('Uptime', `${uptime}`)
			.addField('Guilds', `${client.guilds.cache.size}`)
			.addField('Total Users', `${client.users.cache.size}`)
			.addField('Total Commands', `${client.commands.size}`)
			.addField('Total logs:', `${console.logs.length}`)
			.addField('More Statistics', '[Click here](https://coolboibot.statuspage.io/ "See bot status on the web")')
			.setFooter({ text: `© ${message.client.user.username} ${new Date().getFullYear()} | v${version}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
			.setTimestamp()
			.setColor(message.guild?.me.displayHexColor ?? color.discord);

		await message.reply({ embeds: [statusembed] });
	},
	async executeSlash(interaction, client) {
		const days = Math.floor(client.uptime / 86400000);
		const hours = Math.floor(client.uptime / 3600000) % 24;
		const minutes = Math.floor(client.uptime / 60000) % 60;
		const seconds = Math.floor(client.uptime / 1000) % 60;
		const sample = await new Promise((res, rej) => cpuu((err, data) => (err ? rej(err) : res(data))));
		const uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
		const statusembed = new MessageEmbed()
			.setTitle(`<:CoolBoiBot:905151808186511361> ${interaction.client.user.username} Status <:CoolBoiBot:905151808186511361>`)
			.addField('Hosted:', 'Yes')
			.addField('Mem Usage:', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`)
			.addField('CPU (%):', `${Math.round(sample.percentageBusy() * 100)}%`)
			.addField('Uptime', `${uptime}`)
			.addField('Guilds', `${client.guilds.cache.size}`)
			.addField('Total Users', `${client.users.cache.size}`)
			.addField('Total Commands', `${client.commands.size}`)
			.addField('Total logs:', `${console.logs.length}`)
			.addField('More Statistics', '[Click here](https://coolboibot.statuspage.io/ "See bot status on the web")')
			.setFooter({ text: `© ${interaction.client.user.username} ${new Date().getFullYear()} | v${version}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
			.setTimestamp()
			.setColor(interaction.guild?.me.displayHexColor ?? color.discord);
		await interaction.reply({ embeds: [statusembed] });
	},
};