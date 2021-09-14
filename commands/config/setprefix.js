module.exports = {
  name: 'setprefix',
  description: 'Set the bots prefix!',
  cooldown: 5,
  permissions: 'ADMINISTRATOR',
  usage: '[prefix]',
  guildOnly: true,
  category: 'config',
  execute(message, args) {
    const {MessageEmbed} = require('discord.js');
    const prefix = require('discord-prefix');
    const color = require('../../color.json');
    const guild = message.guild;

    if (!args.length || args[0].toLowerCase() === 'disable' || args[0].toLowerCase() === 'none') {
      setTimeout(() => { prefix.setPrefix('!', guild.id); }, 700);

      return message.reply({embeds: [
        new MessageEmbed()
          .setColor(color.success)
          .setDescription('<:check:807305471282249738> Reset the bots prefix to `!`')
      ]});
    } else if (args[0].length > 3) {
      return message.reply({embeds: [
        new MessageEmbed()
          .setColor(color.fail)
          .setDescription('<:X_:807305490160943104> I can\'t set the prefix to anything more than 3')
      ]});
    }
    message.reply({embeds: [
      new MessageEmbed()
        .setColor(color.success)
        .setDescription(`<:check:807305471282249738> Prefix was succesfully changed to ${args[0]}\n\n *you can check the new prefix by running '<@811024409863258172> prefix'*`)
    ]});
    setTimeout(() => { prefix.setPrefix(args[0], guild.id); }, 700);
  
  }
};