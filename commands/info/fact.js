module.exports = {
  name: 'fact',
  description: '<:check:807305471282249738> Gives a random fact!',
  	cooldown: 1.5,
  	category: 'info',
  execute(message, args) {
    const fetch = require('node-fetch');

    fetch('https://uselessfacts.jsph.pl/random.json?language=en').then(fact => {
      fact.json().then(fact => {
        const user = message.author;
        const color = require('../../color.json');
        const {MessageEmbed} = require('discord.js');
        const embed = new MessageEmbed()
          .setColor(color.bot_theme)
          .setTitle('Random fact')
          .setURL(fact.source_url.toString())
          .setDescription(fact.text.toString())
          .setFooter(user.username, user.displayAvatarURL({dynamic: true}))
          .setTimestamp();

        await message.reply({embeds: [embed]});
      });
    });
  }
};