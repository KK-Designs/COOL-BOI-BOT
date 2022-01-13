module.exports = (giveaway, winners) => {
	winners.forEach((member) => {
		member.send({
			embeds: [{
				color: 'GREEN',
				description: `Congratulations, ${member.user}, you won ${giveaway.prize}!`,
			}],
		});
	});
};
