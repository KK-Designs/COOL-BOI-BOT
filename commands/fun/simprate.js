module.exports = {
  name: 'simprate',
  description: 'Gets your or someone elses simprate!',
  usage: '(@user)',
  cooldown: 1.5,
  category: 'fun',
  options: {
    user: {
      type: "User",
      description: "The user to check the simp rate of"
    }
  },
  async execute(message, args) {
    const user = message.mentions.users.first() ?? message.client.users.cache.get(args[0]) ?? message.author;

    if (user.id === '644054016476577812') {
      return message.channel.send({content: '<@644054016476577812>\'s simprate is 100%'});
    }
    if (user.id === '811024409863258172') {
      return message.channel.send({content: 'I no simp'});
    }
    if (user.id === '776848090564657153') {
      return message.channel.send({content: 'My owner is not a simp, I promise'});
    }
    const simprate = Math.floor(Math.random() * 100);

    await message.channel.send({content: `${user}'s simprate is ${simprate}%`});
  },
  async executeSlash(interaction) {
    const user = interaction.options.getUser("user");
    let simprate = Math.floor(Math.random() * 101);
    if (user.id === "644054016476577812")
      simprate = 100;

    if (user.id === '811024409863258172') {
      return await interaction.reply({content: 'I no simp'});
    }
    if (user.id === '776848090564657153') {
      return await interaction.reply({content: 'My owner is not a simp, I promise'});
    }
    await interaction.reply({
      content: `${user}\'s simprate is ${simprate}%`,
      ephemeral: true
    });
  }
};