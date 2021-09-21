const {MessageEmbed} = require('discord.js');
module.exports = {
  name: 'diceroll',
  description: 'Rolls a dice!  <:dice:800843897261260830>',
  cooldown: 1,
  category: 'general',
  aliases: ['dr'],
  clientPermissons: 'EMBED_LINKS',
  options: {
    limit: {
      type: "Integer",
      description: "The highest possible number",
      required: false
    }
  },
  async execute(message, args) {
    const user = message.author;
    let limit = args[0];
    if (!limit)
      limit = 6;

    const n = Math.floor(Math.random() * limit + 1);

    if (!n || limit <= 0)
      return this.sendErrorMessage(message, 0, 'Please provide a valid number of dice sides');

    const embed = new MessageEmbed()
      .setTitle('<:dice:800843897261260830>  Dice Roll  <:dice:800843897261260830>')
      .setDescription(`${user}, you rolled a **${n}**!`)
      .setFooter(user.username, user.displayAvatarURL({dynamic: true}))
      .setTimestamp()
      .setColor(message.guild?.me.displayHexColor ?? "#FFB700");

    await message.channel.send({embeds: [embed]});
  },
  async executeSlash(interaction) {
    const limit = interaction.options.getInteger("limit") ?? 6;

    if (limit <= 0)
      return await interaction.reply({content: "Please provide a valid number of dice sides", ephemeral: true});

    const n = Math.floor(Math.random() * limit) + 1;
    const user = interaction.user;
    const embed = new MessageEmbed()
      .setTitle('<:dice:800843897261260830>  Dice Roll  <:dice:800843897261260830>')
      .setDescription(`${user}, you rolled a **${n}**!`)
      .setFooter(user.username, user.displayAvatarURL({dynamic: true}))
      .setTimestamp()
      .setColor(interaction.guild?.me.displayHexColor ?? "#FFB700");

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
};