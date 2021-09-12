const fetch = require('node-fetch').default;
const {getPrefix} = require("discord-prefix");
const sendError = require("../../error.js");
const {defaultPrefix} = require("../../config.json");
module.exports = {
  name: 'discordjs',
  description: 'Gets discord.js v12 docs <:djs:808855899141570591>',
  cooldown: 3,
  aliases: ['djs'],
  usage: '[search term]',
  category: 'other',
  options: {},
  async execute(message, args) {
    const prefix = await getPrefix(message.guild?.id ?? message.author.id) ?? defaultPrefix;

    if (!args.length)
      return sendError(`You need to supply search term like \`${prefix}discordjs member\``, message.channel);

    const user = message.author;
    const search = args.join(' ');
    const url = new URL("/v2/embed", "https://djsdocs.sorta.moe");

    url.searchParams.set("src", "stable");
    url.searchParams.set("q", search);
    const res = await fetch(`https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(search)}`);

    if (!res.ok)
      return await sendError(`HTTP Error ${res.status}: ${res.statusText}`);
    
    const embed = await res.json();
    const m = await message.channel.send({embeds: [embed]});
    const emoji = '🗑';

    await m.react(emoji);
    const collector = m.createReactionCollector({
      filter: (r, u) => r.emoji.name === emoji && u.id === message.author.id,
      max: 1,
      time: 10000
    });

    collector.on('collect', r => {
      r.message.delete();
      message.delete();
      if (message.channel.type !== "DM")
        m.reactions.removeAll();
    });
  }
};