const Discord = require('discord.js');
const db = require('quick.db');
const Canvas = require('canvas');

require('canvas-extras');
Canvas.registerFont('./BalooTammudu2-Regular.ttf', {family: 'sans-serif'});
const statuses = {
  online: '#00ff5e',
  dnd: '#bf000d',
  idle: '#ff9d00',
  offline: '#454545'
};
// Allows images to be cached
/** @type {Canvas.Image} */
let background;
/** @type {Canvas.Image} */
let gradient;
module.exports = {
  name: 'level2',
  description: 'Gets your server rank card',
  cooldown: 3,
  category: 'levels',
  guildOnly: true,
  usage: '(@user or id)',
  aliases: ['rank'],
  clientPermissons: 'ATTACH_FILES',
  options: {
    user: {
      type: "User",
      description: "The user to check the levels of",
      required: false
    }
  },
  async execute(message, args) {
    const member = args[0]
      ? message.mentions.members.first() ?? message.guild.members.cache.get(args[0])
      : message.member;

    if (member.user.bot)
      return message.reply({content: 'I don\'t track bots activity'});

    const buffer = await makeCard(message.member);
    const welattachment = new Discord.MessageAttachment(buffer, 'welcome-image.png');

    await message.reply({files: [welattachment]});
  },
  async executeSlash(interaction) {
    const member = interaction.options.getMember("user") ?? interaction.member;

    if (member.user.bot)
      return await interaction.reply({content: 'I don\'t track bots activity'});

    const buffer = await makeCard(member);
    const welattachment = new Discord.MessageAttachment(buffer, 'welcome-image.png');

    await interaction.reply({files: [welattachment]});
  }
};
function applyText(canvas, text, maxWidth = canvas.width - 300) {
  const ctx = canvas.getContext('2d');
  // Declare a base size of the font
  let fontSize = 50;
  do {
    // Assign the font to the context and decrement it so it can be measured again
    ctx.font = `${fontSize -= 2}px sans-serif`;
    // Compare pixel width of the text to the canvas minus the approximate avatar size
  } while (ctx.measureText(text).width > maxWidth);

  // Return the result to use in the actual canvas
  return ctx.font;
}
const pbInfo = {
  x: 269,
  y: 192,
  width: 400,
  height: 25
};
/**
 * @param {import("discord.js").GuildMember} member
 */
async function makeCard(member) {
  const messagefetch = db.fetch(`messages_${member.guild.id}_${member.user.id}`) ?? 0;
  const levelfetch = db.fetch(`level_${member.guild.id}_${member.user.id}`) ?? 0;
  const status = statuses[member.presence?.status ?? "offline"];
  const canvas = Canvas.createCanvas(700, 250);
  const ctx = canvas.getContext('2d');
  let totalmessages = 25 + 25 * levelfetch + Math.floor(levelfetch / 3) * 25;
  // Make the background
  background ??= await Canvas.loadImage('./cool-boi.png');
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  // Make the progress bar
  ctx.beginPath();
  ctx.progressBar(messagefetch, totalmessages, pbInfo.x, pbInfo.y, pbInfo.width, pbInfo.height, '#000387');
  ctx.closePath();
  //
  ctx.strokeStyle = '#74037b';
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
  // Write values for level and messages
  ctx.font = '38px sans-serif';
  ctx.fillStyle = '#000133';
  ctx.fillText(` ${levelfetch}                     ${messagefetch}`, canvas.width / 1.9, canvas.height / 3.6);
  ctx.font = '30px sans-serif';
  ctx.fillStyle = '#13185c';
  // Write headers for level and messages
  ctx.fillText(` LEVEL          MESSAGES`, canvas.width / 2.6, canvas.height / 3.6);
  // Add an exclamation point here and below
  // Write the username
  //ctx.font = '48px sans-serif';
  ctx.textAlign = "center";
  ctx.font = applyText(canvas, member.user.username);
  console.log(ctx.font);
  ctx.fillStyle = '#000133';
  ctx.fillText(`${member.user.username}`, pbInfo.x + pbInfo.width / 2, canvas.height / 1.9);
  // Write the discriminator
  ctx.font = '32px sans-serif';
  ctx.fillStyle = '#13185c';
  ctx.fillText(`#${member.user.discriminator}`, pbInfo.x + pbInfo.width / 2, canvas.height / 1.4);
  // Trim avatar to fit into the circle
  ctx.beginPath();
  ctx.strokeStyle = "#000133";
  ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.stroke();
  ctx.lineWidth = 7;
  ctx.clip();
  // Fill with gradient
  ctx.strokeStyle = status;
  //ctx.strokeStyle = statuses.online;
  ctx.beginPath();
  ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.lineWidth = 99;
  ctx.shadowBlur = 15;
  ctx.shadowColor = "#000133";
  //ctx.fill();
  const avatar = await Canvas.loadImage(member.user.displayAvatarURL({format: 'png'}));

  ctx.drawImage(avatar, 25, 25, 200, 200);
  gradient ??= await Canvas.loadImage('./gradient.png');
  ctx.drawImage(gradient, 256, 256, 256, 256);

  return canvas.toBuffer();
}
