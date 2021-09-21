module.exports = (giveaway, member, reaction) => {
  member.send({
    embeds: [{
      color: "GREEN",
      description: `<:check:807305471282249738> Succesfuly entered the giveway for ${giveaway.prize}`
    }]
  });
};