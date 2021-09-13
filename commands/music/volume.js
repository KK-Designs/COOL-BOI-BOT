const {MessageEmbed} = require("discord.js");
module.exports = {
  name: "volume",
  description: "🔈 Change the server song queue volume",
  usage: '[number]',
  aliases: ["v", "vol"],
  guildOnly: true,
  cooldown: 3,
  category: 'music',
  options: {},
  async execute(message, args) {
    const channel = message.member.voice.channel;

    if (!channel)
      return message.reply({content: "I'm sorry but you need to be in a voice channel to play music!"});

    const serverQueue = message.client.queue.get(message.guild.id);

    if (!serverQueue)
      return message.reply({content: "There is nothing playing in this server."});

    if (!serverQueue.playing)
      return message.reply({content: "There is nothing playing in this server."});

    if (!args[0])
      return message.reply({ content: `The current volume is: **${serverQueue.volume}**` })

    const volume = Number.parseInt(args[0]);

    if (!volume)
      return message.reply({content: ':notes: Numbers only!'});

    if (volume > 150 || volume < 0)
      return message.reply({content: 'You can\'t set the volume more than 150. or lower than 0'});

    serverQueue.volume = volume;
    serverQueue.player.state.resource.volume.setVolumeLogarithmic(volume / 100);
    let xd = new MessageEmbed()
      .setDescription(`I have set the volume to: **${args[0]}/100**`)
      .setAuthor("Server Volume Manager", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
      .setColor("BLUE");

    return message.reply({embeds: [xd]});

  }
};