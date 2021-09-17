const {MessageEmbed} = require('discord.js');
const color = require("../color.json");
const db = require('quick.db');
/** @type {(...args: import("discord.js").ClientEvents["guildMemberRemove"]) => Promise<any>} */
module.exports = async member => {
 
  const guild = member.guild;
  const modLogChannelID = db.get('loggingchannel_' + guild.id);
  const modLogChannel = guild.channels.cache.get(modLogChannelID);
  //member.send("Were sad you left <:Blob_disappointedface:753456000027197556> . But if you want to join back you can join using this link: https://discord.gg/wdjxthF");
  // Send the message to a designated channel on a server:
  const welcomeChannelID = db.get('welcomechannel_' + member.guild.id);
  const welcomeChannel = member.guild.channels.cache.get(welcomeChannelID);

  // Do nothing if the channel wasn't found on this server
  if (!welcomeChannel)
    return;

  // Send the message, mentioning the member
  getWelcomeChannel(member.guild, db).send({content: `${member.user.tag} just left the server  :c`});
  const logChannel = getLogChannel(member.guild, db);

  if (!logChannel)
    return;

  if (member.user.bot)
    return;

  const embed = new MessageEmbed()
    .setAuthor('Member left', 'https://cdn.discordapp.com/emojis/812013459398983690.png')
    .setColor(color.bot_theme)
    .setDescription(`${member.user.tag} left ${member.guild.name}`)
    .addField('Joined:', `${member.joinedAt.toDateString()}`, true)
    .addField('Account Created:', `${member.user.createdAt.toDateString()}`, true)
    .setFooter(`COOL BOI BOT MEMBER LOGGING`)
    .setTimestamp();
  const webhooks = await logChannel.fetchWebhooks();
  const webhook = webhooks.first();

  return await modLogChannel.send({embeds: [embed]});
  // we'll send to the welcome channel.
};