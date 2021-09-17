const {MessageEmbed} = require('discord.js');
const db = require('quick.db');
const color = require('../../color.json');
const {getLogChannel} = require('../../utils.js');
module.exports = {
  name: 'setlogchannel',
  description: 'Set the bots audit logging channel. Do `setlogChannel none` to reset this config',
  cooldown: 5,
  guildOnly: true,
  permissions: 'ADMINISTRATOR',
  usage: '[channel name] or (`none` to clear)',
  category: 'config',
  async execute(message, args, client) {
    const x = message.mentions.channels.first() || message.guild.channels.cache.find(channel => channel.name === args[0]) || message.guild.channels.cache.get(args[0]);

    if (!args[0] && !x) {
      return message.reply({embeds: [
        new MessageEmbed()
          .setColor(color.fail)
          .setDescription('<:X_:807305490160943104> An invalid argument was provided. The only 2 valid ones are `none` to reset configuration or `[channel]` to set a logging channel.')
      ]});
    }
    if (args[0].toLowerCase() === 'none' || args[0].toLowerCase() === 'disable') {
      message.reply({embeds: [
        new MessageEmbed()
          .setColor(color.success)
          .setDescription('<:check:807305471282249738> Stopped logging events')
      ]});

      return await db.set(`loggingchannel_${message.guild.id}`, '0');
    }
    if (!x) {
      return message.reply({embeds: [
        new MessageEmbed()
          .setColor(color.fail)
          .setDescription('<:X_:807305490160943104> Please specify a valid channel.')
      ]});
    }
    await db.set(`loggingchannel_${message.guild.id}`, x.id);
    const webhook = await getLogChannel(message.guild, db).createWebhook('COOL BOI BOT Logging', {
      avatar: 'https://images-ext-1.discordapp.net/external/IRCkcws2ACaLh7lfNgQgZkwMtAPRQvML2XV1JNugLvM/https/cdn.discordapp.com/avatars/811024409863258172/699aa52d1dd597538fc33ceef502b1e6.png'
    });

    console.log(`Created webhook ${webhook}`);
    message.reply({embeds: [
      new MessageEmbed()
        .setColor(color.success)
        .setDescription(`<:check:807305471282249738> Succesfuly set logging channel to ${x}`)
    ]});
  }
};