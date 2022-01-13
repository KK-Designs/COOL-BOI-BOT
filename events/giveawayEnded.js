module.exports = (giveaway, winners) => {
	winners.forEach((member) => {
		member.send({
			content: `Congratulations, ${member.user.username}, you won ${giveaway.prize}!`,
		});
	});
};
