const {GuildMember} = require('discord.js');
const {CommandInteraction} = require('discord.js');
const {MessageEmbed} = require('discord.js');
const statuses = {
  online: '<:online:806215585415168040> Online',
  dnd: '<:dnd:806215804773335120> Do not disturb',
  idle: '<:Idle:806215585267712062> Idle',
  offline: '<:offline:806216568660164659> Offline'
};
module.exports = {
  name: 'user-info',
  description: 'Gets the mentioned user\'s info!',
  usage: '(@user or userid)',
  guildOnly: true,
  aliases: ['who-is'],
  cooldown: 3,
  category: 'info',
  clientPermissons: 'EMBED_LINKS',
  options: {
    user: {
      type: "User",
      description: "The user to get the info of",
      required: false
    }
  },
  async execute(message, args) {
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!args[0]) {
      member = message.member || message.author;
    }
    const roles = member.roles.cache.map(role => role.toString());
    let color = member.displayHexColor;
    if (color === '#000000')
      color = '#C0C0C0';

    //const status = statuses[member.presence?.status ?? "offline"];
    const embed = new MessageEmbed()
      .setTitle(`${member.user.username}`)
      .setColor(color)
      .setThumbnail(member.user.displayAvatarURL({dynamic: true}))
      .addField('Username', member.user.tag)
      .addField('ID', member.id, true)
      .addField('Account Created', member.user.createdAt.toDateString(), true)
      .addField('Joined Server', member.joinedAt.toDateString(), true)
      .addField('Current VC: ', member.voice.channel === null ? 'None' : `<:voice_channel:804772497684693052> ${member.voice.channel.name}`, true)
      //.addField('Status: ', status, true)
      .addField('Roles', roles.join(' **|** '), true)
      .setFooter('Powered by the COOL BOI BOT', member.user.displayAvatarURL({dynamic: true}))
      .setTimestamp();

    message.reply({embeds: [embed]});
  },
  /** @param {CommandInteraction} interaction */
  async executeSlash(interaction) {
    /** @type {GuildMember} */
    const member = interaction.options.getMember("user") ?? interaction.member;
    const roles = member.roles.cache.map(role => role.toString());
    let color = member.displayHexColor;
    if (color === '#000000')
      color = '#C0C0C0';

    //const status = statuses[member.presence?.status ?? "offline"];
    const embed = new MessageEmbed()
      .setTitle(`${member.user.username}`)
      .setColor(color)
      .setThumbnail(member.user.displayAvatarURL({dynamic: true}))
      .addField('Username', member.user.tag)
      .addField('ID', member.id, true)
      .addField('Account Created', member.user.createdAt.toDateString(), true)
      .addField('Joined Server', member.joinedAt.toDateString(), true)
      .addField('Current VC: ', member.voice.channel === null ? 'None' : `<:voice_channel:804772497684693052> ${member.voice.channel.name}`, true)
      //.addField('Status: ', status, true)
      .addField('Roles', roles.join(' **|** '), true)
      .setFooter('Powered by the COOL BOI BOT', member.user.displayAvatarURL({dynamic: true}))
      .setTimestamp();

    await interaction.reply({embeds: [embed]});
  }
};