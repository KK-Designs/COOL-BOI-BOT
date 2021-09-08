module.exports = {
	name: 'face',
	description: 'Gives a random ascii face ( ͝° ͜ʖ͡°)',
	cooldown: 3,
	category: 'fun',
	execute(message) {
		const { MessageEmbed } = require('discord.js');
		const cool = require('cool-ascii-faces');
		const embed = new MessageEmbed()
			.setTitle('Ascii face')
			.setDescription(`\`${cool().toString()}\``)
			.setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp()
			.setColor(message.channel.type === 'GUILD_TEXT' ? message.member.displayHexColor : '#FFB700');
		   message.channel.send({ embeds: [ embed ], reply: { messageReference: message.id } });
	},
};