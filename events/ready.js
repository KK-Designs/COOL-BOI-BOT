const Discord = require('discord.js');
const deployCommands = require("../deploy");
module.exports = async client => {
  const version = Discord.version;

  console.log(`Ready!`);
  console.log('© COOL BOI BOT 2021');
  console.log(`v${version}`);
  setInterval(function() {
    client.user.setPresence({
      activities: [{
        name: ` !help | Exprimental COOL BOI BOT`,
        type: 'LISTENING',
      }],
      status: 'dnd'
      });
    }, 15000);
};