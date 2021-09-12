module.exports = {
  name: 'coinflip',
  description: 'Flips a coin!',
  cooldown: 2,
  category: 'general',
  options: {},
  async execute(message, args) {
    let random = Math.floor(Math.random() * Math.floor(2));
    if (random === 0) {
      message.reply({content: 'I flipped heads!'});
    } else {
      message.reply({content: 'I flipped tails!'});
    }
  },
  async executeSlash(interaction) {
    const number = Math.floor(Math.random() * 2);
    const result = number === 0 ? "heads" : "tails";
      
    await interaction.reply({
      content: `I flipped ${result}!`,
      ephemeral: true
    });
  }
};