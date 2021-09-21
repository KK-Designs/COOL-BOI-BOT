const {MessageEmbed} = require('discord.js');
module.exports = {
  name: 'server',
  description: 'Gets the server info',
  guildOnly: true,
  cooldown: 3,
  category: 'info',
  clientPermissons: 'EMBED_LINKS',
  options: {},
  async execute(message, args) {
    const guild = message.guild;
    let serverName = guild.name;
    let serverIcon = message.guild.iconURL();
    const owner = await message.guild.fetchOwner();
    const infoembed = new MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .setTitle("Server Info")
      .setThumbnail(serverIcon)
      .setDescription(`${message.guild}'s information`)
      .addField("Owner", `The owner of this server is ${owner}`)
      .addField('Server ID: ', guild.id)
      .addField('Server Created: ', guild.createdAt.toDateString())
      .addField("Member Count", `This server has ${message.guild.memberCount} members`)
      .addField("Emoji Count", `This server has ${message.guild.emojis.cache.size} emojis`)
      .addField("Roles Count", `This server has ${message.guild.roles.cache.size} roles`)
      .setFooter(serverName, serverIcon);

    message.reply({embeds: [infoembed]});
  },
  async executeSlash(interaction, args) {
    const guild = interaction.guild;

    if (!guild)
      return await interaction.reply("The command must be ran in a guild");

    let serverName = guild.name;
    let serverIcon = interaction.guild.iconURL();
    const owner = await interaction.guild.fetchOwner();
    const infoembed = new MessageEmbed()
      .setColor(interaction.guild.me.displayHexColor)
      .setTitle("Server Info")
      .setThumbnail(serverIcon)
      .setDescription(`${interaction.guild}'s information`)
      .addField("Owner", `The owner of this server is ${owner}`)
      .addField('Server ID: ', guild.id)
      .addField('Server Created: ', guild.createdAt.toDateString())
      .addField("Member Count", `This server has ${interaction.guild.memberCount} members`)
      .addField("Emoji Count", `This server has ${interaction.guild.emojis.cache.size} emojis`)
      .addField("Roles Count", `This server has ${interaction.guild.roles.cache.size} roles`)
      .setFooter(serverName, serverIcon);

    await interaction.reply({embeds: [infoembed]});
  }
};