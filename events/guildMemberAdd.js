
const {MessageEmbed, MessageAttachment} = require('discord.js');
const db = require("quick.db");
const color = require("../color.json");
const Canvas = require('canvas');
const config = require("../config.json");
const {getLogChannel, getWelcomeChannel} = require("../utils.js");

Canvas.registerFont('./BalooTammudu2-Regular.ttf', {family: 'sans-serif'});
//registerFont('./OpenSans-Regular.ttf', { family: 'sans-serif' });
/** @type {(...args: import("discord.js").ClientEvents["guildMemberAdd"]) => Promise<any>} */
module.exports = async member => {
  const welcomeChannelID = db.get('welcomechannel_' + member.guild.id);
  const welcomeChannel = member.guild.channels.cache.get(welcomeChannelID);
  const guild = member.guild;

  // Send the message to a designated channel on a server:
  /*const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome-and-goodbye');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`Hey ${member}, welcome to **${guild.name}!**`);*/
  //member.send(`Have a good time here in **${guild.name}**! Please make sure to read the rules before sending in #rules. If you have a problem with this server, Dm @ModMail#5460 for help. `);
  if (!welcomeChannel)
    return;

  const canvas = Canvas.createCanvas(700, 250);
  const ctx = canvas.getContext('2d');
  const background = await Canvas.loadImage('./cool-boi.png');
  //const background = await Canvas.loadImage('./wallpaper.jpg');

  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#74037b';
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
  // Slightly smaller text placed above the member's display name
  ctx.font = applyText(canvas, member, 32);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`Hey ${member.user.username},`, canvas.width / 2.5, canvas.height / 3.5);
  ctx.font = '34px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`welcome to the`, canvas.width / 2.5, canvas.height / 2.2);
  // Add an exclamation point here and below
  ctx.font = applyText(canvas, guild.name, 48);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${guild.name}!`, canvas.width / 2.5, canvas.height / 1.3);
  ctx.beginPath();
  ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();
  const avatar = await Canvas.loadImage(member.user.displayAvatarURL({format: 'jpg'}));

  ctx.drawImage(avatar, 25, 25, 200, 200);
  const welattachment = new MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

  getWelcomeChannel(member.guild, db)?.send({content: `Hey ${member.user.tag}, welcome to **${guild.name}!**`, files: [welattachment]});
  if (!getLogChannel(member.guild, db))
    return;

  const embed = new MessageEmbed()
    .setAuthor('Member joined', 'https://cdn.discordapp.com/emojis/812013459298058260.png')
    .setColor(color.bot_theme)
    .setDescription(`${member.user.tag} joined ${member.guild.name}`)
    .addField('Account Created:', `${member.user.createdAt.toDateString()}`, true)
    .setFooter(`COOL BOI BOT MEMBER LOGGING`)
    .setTimestamp();
  const logChannel = getLogChannel(member.guild, db);
  const webhooks = await logChannel.fetchWebhooks();
  const webhook = webhooks.first();

  await webhook.send({
    username: 'COOL BOI BOT Logging',
    avatarURL: config.webhookAvatarURL,
    embeds: [embed]
  });

};
function applyText(canvas, text, fontSize = 70) {
  const ctx = canvas.getContext('2d');

  ctx.font = `${fontSize -= 10}px sans-serif`;
  // Compare pixel width of the text to the canvas minus the approximate text size
  while (ctx.measureText(text).width > canvas.width - 300) {
    // Assign the font to the context and decrement it so it can be measured again
    ctx.font = `${fontSize -= 10}px sans-serif`;
  }

  return ctx.font;
}