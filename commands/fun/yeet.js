module.exports = {
  name: 'yeet',
  description: 'Sends a picture of a yeet',
  cooldown: 1.5,
  category: 'fun',
  options: {},
  async execute(message, args) {
    await message.reply({content: 'https://tenor.com/view/yeet-lion-king-simba-rafiki-throw-gif-16194362'});
  },
  async executeSlash(interaction) {
    await interaction.reply({content: 'https://tenor.com/view/yeet-lion-king-simba-rafiki-throw-gif-16194362'});
  }
};