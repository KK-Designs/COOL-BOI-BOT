const request = require('node-superfetch');
module.exports = {
  name: 'advice',
  description: 'Gives a word of advice!',
  cooldown: 1,
  category: 'fun',
  options: {},
  execute(message, args) {
    message.channel.sendTyping();
    request
      .get('http://api.adviceslip.com/advice')
      .end((err, res) => {
        if (!err && res.status === 200) {
          try {
            JSON.parse(res.text);
          } catch (e) {
            return message.reply({content: 'An api error occurred.'});
          }
          const advice = JSON.parse(res.text);

          setTimeout(() => {
<<<<<<< HEAD
            message.reply({content: `📜  "${advice.slip.advice}"`});
          }, 750);
        } else {
          message.reply({content: `Opps, well this is an error. If this continues dm <@765686109073440808>. \n \nSpeficic error: ${err}`});
=======
            message.reply({ content: `📜  "${advice.slip.advice}"` })
          }, 750);
        } else {
          message.reply({ content: `Opps, well this is an error. If this continues dm <@765686109073440808>. \n \nSpeficic error: ${err}` })
>>>>>>> 9197496 (Inital commit)
          console.error(`REST call failed: ${err}, status code: ${res.status}`);
        }
      });
  },
  async executeSlash(interaction) {
    const res = await request.get('http://api.adviceslip.com/advice').end();

    if (!res.ok)
      return await interaction.reply(`HTTP Error ${res.status}: ${res.statusText}`);

    const advice = JSON.parse(res.body.toString());

    return await interaction.reply({
      content: `📜  "${advice.slip.advice}"`,
      ephemeral: true
    });
  }
};