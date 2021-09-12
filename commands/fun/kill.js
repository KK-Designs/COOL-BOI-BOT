const killnotes = [
  'died',
  `was shot by {{author}}`,
  'fell while trying run to plug in his charger',
  'died from typing too fast',
  `used an uno reverse card and {{author}} died lmao u suck`,
  'burned to death',
  'drowned in the 2 feet pool',
  `was stabbed with a enchanted diamond sword with \`Sharpness V\` <a:Enchanted_Diamond_Sword:802774727093256192>`,
  'was posioned',
  'died from playing fortnite',
  `was posioned, but he had a bucket of milk and {{user}} murdered {{author}}`
];
module.exports = {
  name: 'kill',
  description: 'Kills the mentioned user <a:Enchanted_Diamond_Sword:802774727093256192>',
  cooldown: 1.5,
  category: 'fun',
  options: {
    user: {
      type: "User",
      description: "The user to kill"
    }
  },
  execute(message, args) {
    const user = message.mentions.users.first() ?? message.client.users.cache.get(args[0]) ?? message.author;
    const index = Math.floor(Math.random() * Math.floor(killnotes.length));
    const note = killnotes[index]
      .replaceAll("{{user}}", `${user}`)
      .replaceAll("{{author}}", `${message.author}`);

    message.channel.send({content: `${user} ${note}`});
  },
  async executeSlash(interaction) {
    const user = interaction.options.getUser("user", true);
    const index = Math.floor(Math.random() * killnotes.length);
    const note = killnotes[index]
      .replaceAll("{{user}}", `${user}`)
      .replaceAll("{{author}}", `${interaction.user}`);

    return await interaction.reply({
      content: `${user} ${note}`,
      ephemeral: true
    });
  }
};