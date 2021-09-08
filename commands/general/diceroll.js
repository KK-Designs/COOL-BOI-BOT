module.exports = {
	name: 'diceroll',
	description: 'Rolls a dice!  <:dice:800843897261260830>',
	cooldown: 1,
	category: 'general',
	aliases: ['dr'],
	clientPermissons: 'EMBED_LINKS',
	execute(message, args) {
		const user = message.author;
		const { MessageEmbed } = require('discord.js');
		let limit = args[0];
		if (!limit) limit = 6;
		const n = Math.floor(Math.random() * limit + 1);
		if (!n || limit <= 0) {return this.sendErrorMessage(message, 0, 'Please provide a valid number of dice sides');}
		const embed = new MessageEmbed()
			.setTitle('<:dice:800843897261260830>  Dice Roll  <:dice:800843897261260830>')
			.setDescription(`${user}, you rolled a **${n}**!`)
			.setFooter(user.username, user.displayAvatarURL({ dynamic: true }))
			.setTimestamp()
			.setColor(message.channel.type === 'dm' ? '#FFB700' : message.guild.me.displayHexColor,
			);
		message.channel.send({ embeds: [ embed ] });
	},
};