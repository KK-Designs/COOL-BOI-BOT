const sendError = require("../../error.js");
const bounds = [19, 18, 20, 19, 20, 20, 22, 22, 22, 22, 21, 21];
const signs = [
  "Capricorn", "Aquarius", "Pisces",
  "Aries", "Taurus", "Gemini",
  "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius"
];
const monthNames = [
  "January", "February", "March",
  "April", "May", "June",
  "July", "August", "September",
  "October", "November", "December"
];
module.exports = {
  name: 'zodiac',
  description: 'Returns your zodiac sign with the date spcified',
  usage: '[mm dd]',
  cooldown: 3,
  category: 'fun',
  options: {
    month: {
      type: "Integer",
      description: "The birth month",
      choices: monthNames.reduce((obj, month, i) => ({...obj, [month]: i}), {})
    },
    day: {
      type: "Integer",
      description: "The birth day"
    }
  },
  async execute(message, args) {
    const month = parseInt(args[0]);
    const day = parseInt(args[1]);

    if (!month) {
      return sendError('Please enter a valid number for month.', message.channel);
    }
    if (month < 1 || month > 12) {
      return sendError('Please enter a valid month [1, 12].', message.channel);
    }
    if (!day) {
      return sendError('Please enter a valid number for day.', message.channel);
    }
    if (day < 1 || day > 31) {
      return sendError('Please enter a valid day [1, 31].', message.channel);
    }
    const signIndex = (month + +(day > bounds[month])) % monthNames.length;
    const sign = signs[signIndex];

    await message.reply(`You're zodiac is ${sign}`);
        
  },
  async executeSlash(interaction) {
    const month = interaction.options.getInteger("month", true);
    const day = interaction.options.getInteger("day", true);

    if (day < 1 || day > 31)
      return await interaction.reply("Invalid day provided");

    const signIndex = (month + +(day > bounds[month])) % monthNames.length;
    const sign = signs[signIndex];

    await interaction.reply(`You're zodiac is ${sign}`);
  }
};