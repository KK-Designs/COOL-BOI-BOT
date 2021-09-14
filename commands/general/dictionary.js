const {MessageEmbed} = require('discord.js');
const prefix = require('discord-prefix');
const Owlbot = require('owlbot-js');
const client = Owlbot('90ff8fb2e0b4a5149df34b606a9ce04e47eaec5d');
module.exports = {
  name: 'dictionary',
  description: 'Lookup any word on the dictionary 📖 Powered by OwlBot 🦉',
  aliases: ['define'],
  cooldown: 10,
  usage: '[message]',
  clientPermissons: 'EMBED_LINKS',
  category: 'general',
  options: {
    word: {
      type: "String",
      description: "The word to check"
    }
  },
  async execute(message, args) {
    let guildPrefix = prefix.getPrefix(message.guild?.id ?? message.author.id) ?? "?";
    if (!args[0]) {
      return message.reply({content: 'Please provide a word for me to define!'});
    }
    const result = await client.define(args[0]).catch(() => null);

    if (!result?.definitions) {
      return message.reply({content: `Could not find definitions for "${args[0]}". Try using the \`${guildPrefix}urban\` command for slangs.`});
    }
    const embed = new MessageEmbed()
      .setTitle(`Definition for "${result.word}"`)
      .addField('Definition: ', result.definitions[0].definition || 'Not avavible')
      .addField('Example: ', result.definitions[0].example || 'Not avavible')
      .addField('Type: ', result.definitions[0].type || 'Not avavible')
      .addField('Pronunciation: ', result.pronunciation || 'Not avavible')
      .setFooter('Powered by OwlBot')
      .setTimestamp()
      .setColor(message.channel.type === 'GUILD_TEXT' ? message.member.displayHexColor : '#FFB700');

    await message.reply({embeds: [embed]});
  },
  async executeSlash(interaction) {
    const guildPrefix = prefix.getPrefix(interaction.guild?.id ?? interaction.user.id) ?? "!";
    const word = interaction.options.getString("word", true);
    const result = await client.define(word).catch(() => null);

    if (!result?.definitions) {
      return interaction.reply({
        content: `Could not find definitions for "${word}". Try using the \`${guildPrefix}urban\` command for slangs.`
      });
    }
    const embed = new MessageEmbed()
      .setTitle(`Definition for "${result.word}"`)
      .addField('Definition: ', result.definitions[0].definition || 'Not avavible')
      .addField('Example: ', result.definitions[0].example || 'Not avavible')
      .addField('Type: ', result.definitions[0].type || 'Not avavible')
      .addField('Pronunciation: ', result.pronunciation || 'Not avavible')
      .setFooter('Powered by OwlBot')
      .setTimestamp()
      .setColor(interaction.member?.displayHexColor ?? '#FFB700');

    await interaction.reply({embeds: [embed]});
  }
};