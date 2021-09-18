const simplydjs = require('simply-djs');
const color = require('../../color.json');
module.exports = {
  name: 'rps',
  description: 'Play a game of Rock paper scissors 🪨 📰 ✂️',
  aliases: ['rockpaperscissors'],
  cooldown: 15,
  category: 'games',
  options: {
    user: {
      type: "User",
      description: "The user to compete with in tic-tac-toe"
    }
  },
  async execute(message, args) {
    await simplydjs.rps(message, {
      embedColor: color.bot_theme, // default: #075FFF
      embedFooter: 'Powered by COOL BOI BOT Games',
      credit: false
    });
  },
  async executeSlash(interaction) {
    await interaction.deferReply();
    await simplydjs.rps(interaction, {
      slash: true,
      embedColor: color.bot_theme, // default: #075FFF
      embedFooter: 'Powered by COOL BOI BOT Games',
      credit: false
    });
  }
};