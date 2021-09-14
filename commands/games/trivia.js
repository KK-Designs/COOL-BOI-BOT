module.exports = {
  name: 'trivia',
  description: 'Play a game of trivia! ❔',
  usage: '[difficulty]',
  cooldown: 5,
  category: 'games',
  execute(message, args) {
    const {Trivia} = require('discord-gamecord');
    const color = require('../../color.json');
    const sendError = require('../../error.js');
    const difficulties = [
      'easy',
      'medium',
      'hard'
    ];

    if (!args[0])
      return sendError('You need to specify a difficulty', message.channel);

    if (!difficulties.includes(args[0].toLowerCase()))
      return sendError('Please provide a valid difficulty', message.channel);

    new Trivia({
      message: message,
      opponent: message.mentions.users.first(),
      embed: {
        title: 'Trivia',
        description: '🕓 You have {time} seconds to respond!',
        color: color.bot_theme
      },
      time: 60000,
      difficulty: args[0],
      buttons: {
        one: '1️⃣',
        two: '2️⃣',
        three: '3️⃣',
        four: '4️⃣'
      },
      winMessage: '<:check:807305471282249738> Your answer was correct! You answered **{answer}**',
      loseMessage: '<:X_:807305490160943104> Your answer was Incorrect! The correct answer was **{answer}**',
      othersMessage: '<:X_:807305490160943104> You are not allowed to use buttons for this message!'
    }).startGame();
  }
};