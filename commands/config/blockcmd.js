module.exports = {
  name: 'blockcmd',
  description: 'Block any command from being used in this server!',
  cooldown: 5,
  guildOnly: true,
  permissions: 'ADMINISTRATOR',
  usage: '[command name or none to clear all blocked commands]',
  category: 'config',
  async execute(message, args, client) {
	 const db = require('quick.db');
	 const {MessageEmbed} = require('discord.js');
	 const {suggest} = require('@laboralphy/did-you-mean');
	 const color = require('../../color.json');
	 const {commands} = message.client;
	 const name = args[0].toLowerCase();
	 const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

    if (args[0].toLowerCase() === 'clear' || args[0].toLowerCase() === 'none') {
      message.reply({embeds: [
        new MessageEmbed()
          .setColor(color.success)
          .setDescription('<:check:807305471282249738> Unblocked all commands')
      ]});

      return await db.set(`blockcmds_${message.guild.id}`, '0');
    }
    if (!command) {
      const thing = commands.map(command => command.name);
      const result = suggest(name, thing);
      let error = `that\'s not a valid command, did you mean \`${result.join(' or ')}\`?`;
      if (!result.length) {
			  error = 'that\'s not a valid command!';
      }

      return message.reply({embeds: [
        new MessageEmbed()
          .setColor(color.fail)
          .setDescription(`<:X_:807305490160943104> ${error}`)
      ]});
		  }
    if (args[0].toLowerCase() === 'level') {
      await db.set(`blockcmds_${message.guild.id}`, [command.name, command.aliases ? command.aliases : '']);

      return message.reply({embeds: [
        new MessageEmbed()
          .setColor(color.success)
          .setDescription(`<:check:807305471282249738> Succesfuly blocked the command ${command.name}. Please note: Since you disabled the \`level\` command you will not be able to recive the "You Leveled up!" message, however, messages will still be saved for later use. `)
      ]});
    }
    await db.set(`blockcmds_${message.guild.id}`, [command.name, command.aliases ? command.aliases : '']);
    message.reply({embeds: [
      new MessageEmbed()
        .setColor(color.success)
        .setDescription(`<:check:807305471282249738> Succesfuly blocked the command ${command.name}`)
    ]});
  }
};