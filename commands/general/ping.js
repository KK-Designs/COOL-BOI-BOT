module.exports = {
	name: 'ping',
	description: 'Ping! Returns the bots ping! 🏓',
	cooldown: 2,
	category: 'general',
	execute(message, args, client) {
		const { MessageEmbed } = require('discord.js');
		const embed = new MessageEmbed()
			.setTitle('<a:loading:808390866367545384> Pinging...')
			.setColor(message.channel.type === 'GUILD_TEXT' ? message.member.displayHexColor : '#FFB700');

		message.channel.send({ embeds: [ embed ], reply: { messageReference: message.id } }).then((msg) => {
			const pingembed = new MessageEmbed()
				.setTitle(`${client.user.username}\'s Ping\n------------------------`)
				.addField('API Latency:', `${Math.round(client.ws.ping)}ms`, true)
				.addField('Time between messages:', `${Date.now() - message.createdTimestamp}ms`)
				.setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
				.setTimestamp()
				.setColor(message.channel.type === 'GUILD_TEXT' ? message.guild.me.displayHexColor : '#FFB700');
			setTimeout(function() {
				msg.edit({ embeds: [ pingembed ] });
			}, Date.now() - message.createdTimestamp);
		});
	},
};