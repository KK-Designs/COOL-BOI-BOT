const fetch = require('node-fetch').default;
const color = require("../../color.json");
const {MessageEmbed} = require('discord.js');
module.exports = {
  name: 'ip',
  description: 'Get your ip\'s info. YOU INFORMATION OR IP IS NEVER DISTRIBUTED ANYWHERE.  YOUR THINGS ARE SAFE',
  cooldown: 3,
  usage: '[your ip]',
  category: 'info',
  options: {
    ip: {
      type: "String",
      description: "The ipv4 address to lookup"
    }
  },
  async execute(message, args, client) {
    if (!args.length)
      return message.reply({content: 'I need your IPv4 to get your info'});

    if (message.guild) {
      message.delete();

      return message.reply({content: 'if you want to expose you ip to everyone here do this in a dm with me 🙂'});
    }
    const data = await fetch(`https://ipinfo.io/${args[0]}/geo`)
      .then((res) => res.json());

    if (data.error) {
      return message.reply({content: data.error.message});
    }
    const ip = data.ip;
    const embed = new MessageEmbed()
      .setColor(color.bot_theme)
      .setTitle(`IP info for \`${ip}\``)
      .addField(`IP:`, ip);
      
    if (data.bogon) {
      embed.addField("Bogon", "true");
    } else {
      const city = data.city;
      const region = data.region;
      const country = data.country;
      const location = data.loc;
      const postal = data.postal;
      const timezone = data.timezone;
      const user = message.author;

      embed
        .addField(`City:`, city)
        .addField(`Region:`, region)
        .addField(`Country:`, country)
        .addField(`Location:`, location)
        .addField(`Postal code:`, postal)
        .addField(`Timezone:`, timezone)
        .setFooter(user.username, user.displayAvatarURL({dynamic: true}))
        .setTimestamp();
    }
    message.reply({embeds: [embed]});
  },
  async executeSlash(interaction) {
    const ipReq = interaction.options.getString("ip");
    const url = new URL(`/${ipReq}/geo`, "https://ipinfo.io");
    const res = await fetch(url);

    if (!res.ok)
      return await interaction.reply('Please provide a valid IP address');

    const data = await res.json();
    const ip = data.ip;
    const embed = new MessageEmbed()
      .setColor(color.bot_theme)
      .setTitle(`IP info for \`${ip}\``)
      .addField(`IP:`, ip);
      
    if (data.bogon) {
      embed.addField("Bogon", "true");
    } else {
      const city = data.city;
      const region = data.region;
      const country = data.country;
      const location = data.loc;
      const postal = data.postal;
      const timezone = data.timezone;
      const user = interaction.user;

      embed
        .addField(`City:`, city)
        .addField(`Region:`, region)
        .addField(`Country:`, country)
        .addField(`Location:`, location)
        .addField(`Postal code:`, postal)
        .addField(`Timezone:`, timezone)
        .setFooter(user.username, user.displayAvatarURL({dynamic: true}))
        .setTimestamp();
    }
    await interaction.reply({embeds: [embed], ephemeral: true});

  }
};