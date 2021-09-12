const {MessageEmbed} = require('discord.js');
const meant = require('meant');
const prefix = require('discord-prefix');
const {defaultPrefix} = require("../../config.json");
const categorynames = [
  'fun',
  'general',
  'info',
  'levels',
  'moderation',
  'music',
  'other',
  'util'
];
module.exports = {
  name: 'help',
  description: 'Gives you information about each command!',
  usage: '(command name)',
  aliases: ['commands'],
  cooldown: 3,
  category: 'general',
  clientPermissons: 'EMBED_LINKS',
  options: {},
  async execute(message, args) {
    const user = message.author;
    const guildPrefix = prefix.getPrefix(message.guild?.id ?? message.author.id) ?? defaultPrefix;
    const {commands} = message.client;
    const embed = new MessageEmbed()
      .setTimestamp()
      .setColor(message.guild?.me.displayHexColor ?? '#FFB700');

    if (!args.length) {
      const description = commands.map(command => `\`${command.name}\``).join(' | ')
        + "\n"
        + `You can use \`${guildPrefix}help [command name]\` to get info on a specific command.`
        + ` Use \`${guildPrefix}help [category name]\` to get specific category commands.`
        + ` Make sure to use \`${guildPrefix}\` or @mention me before each command!`;

      embed.setTitle(`Commands`)
        .setDescription(description)
        .setFooter(`THE COOL BOI BOT`, `https://images-ext-2.discordapp.net/external/PtRqDuS2wA-2WgNWTTLOwbG-B6ioUW6YPiRtxgs4ap4/https/cdn.discordapp.com/avatars/769415264306987068/699aa52d1dd597538fc33ceef502b1e6.webp`);

      return await message.channel.send({embeds: [embed]});
    }
    const name = args[0].toLowerCase();

    if (categorynames.includes(name)) {
      const categoryCmds = commands.filter(c => c.category === name).map(c => `\`${c.name}\``);
      const desc = categoryCmds.join(' | ')
       + `\n\nYou can use \`${guildPrefix}help [command name]\` to get info on a specific command.`
       + ` Make sure to use \`${guildPrefix}\` or @mention me before each command!`;

      embed
        .setTitle(`Commands in ${name}`)
        .setDescription(desc)
        .setFooter(`THE COOL BOI BOT`, `${message.client.user.displayAvatarURL({dynamic: true})}`);

      return await message.channel.send({embeds: [embed]});
    }
    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

    if (!command) {
      const commandNames = commands.map(c => c.name);
      const result = meant(name, commandNames);
      let error = `that's not a valid command!`;
      if (result.length) {
        error = error.slice(0, -1) + `, did you mean \`${result.join(' or ')}\`?`;
      }

      return await message.reply({content: `${error}`});
    }
    embed
      .setTitle(`Command Name: ${command.name}`)
      .setDescription(
        '[] arguments mean required, and () arguments mean optional.'
        + ' If theres none it means the there are no arguments needed to run the command'
      )
      .setFooter(user.username, user.displayAvatarURL({dynamic: true}));
    embed.addField("**Description:**", command.description, true)
      .addField("**Usage:**", `${guildPrefix}${command.name} ${command.usage}`, true)
      .addField("**Cooldown:**", `${command.cooldown ?? 3} seconds`, true)
      .addField("**Category:**", `${command.category}`, true);
    if (command.aliases)
      embed.addField("**Aliases:**", command.aliases.join(', '), true);
    else
      embed.addField("** **", "** **", true);

    embed.addField(
      "**Permissions:**",
      // eslint-disable-next-line no-extra-parens
      ["VIEW_CHANNEL", "SEND_MESSAGES", ...(command.permissions ?? [])].join(', '),
      true
    )
      .addField(
        "**Bot Permissions:**", // eslint-disable-next-line no-extra-parens
        ["VIEW_CHANNEL", "SEND_MESSAGES", ...(command.clientPermissions ?? [])].join(', '),
        true
      )
      .addField(
        command.guildOnly
          ? `This command can be used only in servers`
          : `This command can be used in servers and dms`,
        "** **"
      );

    return await message.channel.send({embeds: [embed]});
  }
};