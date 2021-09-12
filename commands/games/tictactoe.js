module.exports = {
  name: 'tictactoe',
  description: 'Play a fun game of tictactoe with your friends!',
  aliases: ['ttt'],
  	cooldown: 15,
  	category: 'games',
  execute(message, args) {
    const simplydjs = require('simply-djs');
    const color = require('../../color.json');

    simplydjs.tictactoe(message, {
      embedColor: color.bot_theme, // default: #075FFF
      embedFooter: 'Powered by COOL BOI BOT Games',
      credit: false
    });
  }
};