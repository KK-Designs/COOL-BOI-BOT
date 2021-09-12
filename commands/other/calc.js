const simplydjs = require('simply-djs');
const color = require('../../color.json');
module.exports = {
  name: 'calc',
  description: 'Calculate the provided expression ➕',
  usage: '[expression]',
  cooldown: 3,
  category: 'other',
  options: {},
  async execute(message, args, client) {
    let input = args.join(' ');
    let output;
    if (!input)
      return sendError('Please provide a equation for me to solve', message.channel);

    await simplydjs.calculator(message, {
      embedColor: color.bot_theme, // default: #075FFF
      credit: false
    });
  }
};