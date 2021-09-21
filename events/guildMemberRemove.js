const {MessageEmbed} = require('discord.js');
const {getLogChannel, getWelcomeChannel} = require("../utils");
const color = require("../color.json");
const db = require('quick.db');
const config = require("../config.json");
module.exports = async member => {
 
  const guild = member.guild;
  //member.send("Were sad you left <:Blob_disappointedface:753456000027197556> . But if you want to join back you can join using this link: https://discord.gg/wdjxthF");
  // Send the message to a designated channel on a server:
  const welcomeChannel = getWelcomeChannel(guild, db);

  // Do nothing if the channel wasn't found on this server
  if (!welcomeChannel)
    return;

  // Send the message, mentioning the member
  welcomeChannel.send({content: `${member.user.tag} just left the server  :c`});
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

  await webhook.send({
    username: 'COOL BOI BOT Logging',
    avatarURL: config.webhookAvatarURL,
    embeds: [embed]
  });
  // we'll send to the welcome channel.
};