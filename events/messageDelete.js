const {MessageEmbed} = require('discord.js');
const db = require('quick.db');
const color = require("../color.json");
const {getLogChannel} = require('../utils.js');
/** @type {(...args: import("discord.js").ClientEvents["messageDelete"]) => Promise<any>} */
module.exports = async message => {
  if (message.partial)
    return;

  if (message.channel.type === 'DM')
    return;

  if (message.author.bot)
    return;

  if (message.content === '')
    return;

  const messageChannel = message.channel.name;

  if (!getLogChannel(message.guild, db))
    return;

  // ignore direct messages
  if (!message.guild)
    return;

  const fetchedLogs = await message.guild.fetchAuditLogs({
    limit: 1,
    type: 'MESSAGE_DELETE'
  });
  // Since we only have 1 audit log entry in this collection, we can simply grab the first one
  const deletionLog = fetchedLogs.entries.first();

  // Let's perform a coherence check here and make sure we got *something*
  if (!deletionLog)
    return console.log(`A message by ${message.author.tag} was deleted, but no relevant audit logs were found.`);

  // We now grab the user object of the person who deleted the message
  // Let us also grab the target of this action to double check things
  const {executor, target} = deletionLog;
  const user = executor.tag;
  const delembed = new MessageEmbed()
    .setColor(color.bot_theme)
    .setAuthor(executor.tag, executor.displayAvatarURL({dynamic: true}))
    .setTitle(`Message by ${message.author.tag} was deleted in #${messageChannel}, by ${executor.tag}`)
    .setDescription(message.content)
    .setFooter('COOL BOI BOT MESSAGE LOGGING')
    .setTimestamp();
  const delembed1 = new MessageEmbed()
    .setColor(color.bot_theme)
  // .setAuthor(executor.tag,  executor.displayAvatarURL({ dynamic: true }))
    .setTitle(`Message by ${message.author.tag} was deleted in #${messageChannel}`)
    .setDescription(message.content)
    .setFooter('COOL BOI BOT MESSAGE LOGGING')
    .setTimestamp();

  if (message.author.bot)
    return;

  // And now we can update our output with a bit more information
  // We will also run a check to make sure the log we got was for the same author's message
  if (target.id === message.author.id) {
    //modLogChannel.send({ embeds: [ delembed ] });
    const webhooks = await getLogChannel(message.guild, db).fetchWebhooks();
    const webhook = webhooks.first();

    await webhook.send({
      username: 'COOL BOI BOT Logging',
      avatarURL: 'https://images-ext-1.discordapp.net/external/IRCkcws2ACaLh7lfNgQgZkwMtAPRQvML2XV1JNugLvM/https/cdn.discordapp.com/avatars/811024409863258172/699aa52d1dd597538fc33ceef502b1e6.png',
      embeds: [delembed1]
    });
  } else {
    //modLogChannel.send({ embeds: [ delembed1 ] });
    const webhooks = await getLogChannel(message.guild, db).fetchWebhooks();
    const webhook = webhooks.first();

    await webhook.send({
      username: 'COOL BOI BOT Logging',
      avatarURL: 'https://images-ext-1.discordapp.net/external/IRCkcws2ACaLh7lfNgQgZkwMtAPRQvML2XV1JNugLvM/https/cdn.discordapp.com/avatars/811024409863258172/699aa52d1dd597538fc33ceef502b1e6.png',
      embeds: [delembed]
    });
  }

};