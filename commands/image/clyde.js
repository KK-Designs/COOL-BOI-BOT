module.exports = {
  name: 'clyde',
  description: 'Make the discord clyde bot send a message!  <:clyde:772958152214839307>',
  usage: '[message]',
  cooldown: 3,
  category: 'image',
  clientPermissons: 'EMBED_LINKS',
  async execute(message, args) {
    const fetch = require('node-fetch');
    const user = message.channel.type === 'dm' ? message.mentions.users.first() || message.author : message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.author;
    const {MessageEmbed} = require('discord.js');

    // Get message
    if (!args[0])
      return message.reply('Please provide a message to clydify');

    let clyde = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    if (clyde.length > 68)
      clyde = clyde.slice(0, 65) + '...';

    try {
      const res = await fetch('https://nekobot.xyz/api/imagegen?type=clyde&text=' + clyde);
      const img = (await res.json()).message;
      const embed = new MessageEmbed()
        .setTitle('<:clyde:772958152214839307>  Clyde  <:clyde:772958152214839307>')
        .setImage(img)
        .setFooter(user.username, user.displayAvatarURL({dynamic: true}))
        .setTimestamp()
        .setColor('#CFF6FF');

      message.channel.send({embeds: [embed], reply: {messageReference: message.id}});
    } catch (err) {
      message.channel.send({content: `Oops, well this is an error. If this continues dm <@765686109073440808>. \n \nSpeficic error: ${err}`});
    }
  }
};