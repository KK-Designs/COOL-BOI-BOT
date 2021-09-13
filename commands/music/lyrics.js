const {MessageEmbed} = require("discord.js");
const color = require('../../color.json');
const solenolyrics = require("solenolyrics");
const fetch = require("node-fetch").default;
module.exports = {
  name: "lyrics",
  description: "🎶 Get lyrics for the currently playing song",
  aliases: ["ly"],
  cooldown: 3,
  category: 'music',
  options: {},
  async execute(message, args) {
    
    const queue = message.client.queue.get(message.guild.id);

    if (!queue)
      return message.reply({content: "There is nothing playing."});

    let lyrics;
    let msg;
    try {
      //lyrics = await lyricsFinder(queue.songs[0].title, "");
      msg = await message.channel.send(`Fetching lyrics for ${queue.songs[0].title}...`);
      lyrics = await getLyrics(queue.songs[0].title);
      if (!lyrics)
        lyrics = `No lyrics found for ${queue.songs[0].title}.`;
    } catch (error) {
      lyrics = `No lyrics found for ${queue.songs[0].title}.`;
    }
    let lyricsEmbed = new MessageEmbed()
      .setAuthor(`${queue.songs[0].title} — Lyrics`, "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif", queue.songs[0].url)
      .setThumbnail(queue.songs[0].img)
      .setColor(message.channel.type === "DM" ? color.bot_theme : message.guild.me.displayHexColor)
      .setDescription(lyrics)
      .setTimestamp()
      .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}));
    if (lyricsEmbed.description.length >= 2048) {
      lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
    } else {
      message.reply({embeds: [lyricsEmbed]}).catch(console.error);
      msg.delete();
    }

  },
  async executeSlash(interaction) {
    
    const queue = interaction.client.queue.get(interaction.guild.id);

    if (!queue)
      return interaction.reply({content: "There is nothing playing."});

    let lyrics;
    try {
      await interaction.deferReply();
      lyrics = await getLyrics(queue.songs[0].title)
        ?? `No lyrics found for ${queue.songs[0].title}.`;
    } catch (error) {
      console.error(error);
      lyrics = `No lyrics found for ${queue.songs[0].title}.`;
    }
    let lyricsEmbed = new MessageEmbed()
      .setAuthor(`${queue.songs[0].title} — Lyrics`, "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif", queue.songs[0].url)
      .setThumbnail(queue.songs[0].img)
      .setColor(interaction.channel.type === "DM" ? color.bot_theme : interaction.guild.me.displayHexColor)
      .setDescription(lyrics)
      .setTimestamp()
      .setFooter(interaction.user.username, interaction.user.displayAvatarURL({dynamic: true}));
    if (lyricsEmbed.description.length >= 2048) {
      lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
    }
    await interaction.editReply({embeds: [lyricsEmbed]}).catch(console.error);
  }
};
async function getLyrics(title) {
  const url = new URL("/lyrics", "https://some-random-api.ml");

  url.searchParams.set("title", title);
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  console.log(json)

  return json.lyrics;
}