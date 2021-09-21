const {MessageEmbed} = require('discord.js');
module.exports = async (text, channel) => {
  let message;
  const embed = new MessageEmbed()
    .setColor('RED')
    .setTitle('<:error_x:815780013256343582> Error: ')
    .setDescription(text)
    .setFooter(channel.client.user.username, channel.client.user.displayAvatarURL({dynamic: true}));

  await channel.send({embeds: [embed]});
};