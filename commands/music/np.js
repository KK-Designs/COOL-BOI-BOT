const {MessageEmbed} = require('discord.js');
const humanizeDuration = require("humanize-duration");
const Bar = require("string-progressbar")
module.exports = {
  name: 'np',
  description: 'See the surrent dong playing.',
  cooldown: 5,
  guildOnly: true,
  category: 'music',
  aliases: ['nowplaying'],
  options: {},
  execute(message) {
    const serverQueue = message.client.queue.get(message.guild.id);
    
    if (!serverQueue)
      return message.channel.send('There is nothing playing.');

    const embed = new MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .setTitle(`Current Song playing`)
      .addField(`<:playing:813209288100151366> Now playing:`, `${serverQueue.songs[0].title} • ${serverQueue.songs[0].author}`, true)     //.addField(`Duration:`, serverQueue.songs.map(song => `${humanizeDuration(song.duration * 1000)}`), true)
      .addField(`Duration:`, `${humanizeDuration(serverQueue.songs[0].duration * 1000)}`, true)
      .setTimestamp()
      .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}));

    return message.reply({embeds: [embed]});
  },
  async executeSlash(interaction) {
    const serverQueue = interaction.client.queue.get(interaction.guild.id);
    
    if (!serverQueue)
      return interaction.channel.send('There is nothing playing.');

    const currentSong = serverQueue.songs[0];
    const currentDuration = serverQueue.player.state.resource.playbackDuration
    const totalDuration = currentSong.duration * 1000;
    const bar = Bar.splitBar(totalDuration, currentDuration, 20).join("")
    const embed = new MessageEmbed()
      .setColor(interaction.guild.me.displayHexColor)
      .setTitle(`Current Song playing`)
      .addField(
        `<:playing:813209288100151366> Now playing:`,
        `${currentSong.title} • ${currentSong.author}`,
        true
      )
      //.addField(`Duration:`, serverQueue.songs.map(song => `${humanizeDuration(song.duration * 1000)}`), true)
      .addField(`Duration:`, `${humanizeDuration(totalDuration)}`, true)
      .addField(`Bar:`, bar, true)
      .setTimestamp()
      .setFooter(interaction.user.username, interaction.user.displayAvatarURL({dynamic: true}));

    return await interaction.reply({embeds: [embed]});
  }
};