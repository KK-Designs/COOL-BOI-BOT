module.exports = {
  name: 'rps',
  description: 'Play a game of Rock paper scissors 🪨 📰 ✂️',
  aliases: ['rockpaperscissors'],
  cooldown: 15,
  category: 'games',
  execute(message, args) {
    const simplydjs = require('simply-djs');
    const color = require('../../color.json');

    simplydjs.rps(message, {
      embedColor: color.bot_theme, // default: #075FFF
      embedFooter: 'Powered by COOL BOI BOT Games',
      credit: false
    });
  }
};