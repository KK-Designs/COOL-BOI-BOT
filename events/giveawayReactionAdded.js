const { inlineCode } = require('@discordjs/builders');
module.exports = (giveaway, member) => {
	member.send({
		embeds: [{
			color: 'GREEN',
			description: `<:check:807305471282249738> Succesfuly entered the giveway for ${inlineCode(giveaway.prize)}`,
		}],
	});
};
