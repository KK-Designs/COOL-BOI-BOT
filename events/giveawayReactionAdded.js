module.exports = (giveaway, member, reaction) => {
	const { MessageEmbed } = require('discord.js');
	member.send({
		embeds: [
			new MessageEmbed()
				.setColor('GREEN')
				.setDescription(
					`<:check:807305471282249738> Succesfuly entered the giveway for ${giveaway.prize}`,
				),
		],
	});
};
