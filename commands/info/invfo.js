const {MessageEmbed} = require('discord.js');
const discordInv = require('discord-inv');
const prefix = require('discord-prefix');
const getColors = require('get-image-colors');
const sendError = require('../../error.js');
module.exports = {
  name: 'invfo',
  aliases: ['icon', 'pfp', 'av'],
  description: 'Gives info of the specified invite link 🔗',
  usage: '[invite link]',
  category: 'info',
  cooldown: 5,
  clientPermissons: 'EMBED_LINKS',
  execute(message, args) {
    const inviteurl = args[0];

    try {
      discordInv.getInv(discordInv.getCodeFromUrl(inviteurl)).then(invite => {
        
        const guildPrefix = prefix.getPrefix(message.guild?.id ?? message.author.id);
        const user = message.mentions.users.first() || message.author;
        let verL;
        let color;
        if (invite.guild.verification_level === '4') {
          verL = 'Intense (Verified Account & Verified Phone linked)';
        }
        if (invite.guild.verification_level === '3') {
          verL = 'Secure (Verified Account & Guild member for 10+ minutes)';
        }
        if (invite.guild.verification_level === '2') {
          verL = 'Medium (Verified Account for 5 minutes+)';
        }
        if (invite.guild.verification_level === '1') {
          verL = 'Low (Verified Account)';
        }
        if (invite.guild.verification_level === '0') {
          verL = 'None (No Restriction)';
        }
        getColors(user.displayAvatarURL({format: 'png'})).then(colors => {
          color = colors.map(color => color.hex())[0].toString();
          console.log(colors.map(color => color.hex())[0].toString());
          const inviteEmbed = new MessageEmbed()
            .setColor(color)
            .setTitle(invite.guild.name)
            .setURL(invite.url)
            .setThumbnail(`${invite.guild.iconURL}`)
            .setDescription(invite.guild.description || 'None')
            .addField('Refering Channel: ', `${invite.channel.name}`)
            .addField('Verification level: ', `${verL}`)
            .addField('\🟢 ', invite.approximate_presence_count.toString(), true)
            .addField('\⚫ ', invite.approximate_member_count.toString(), true)
            .setTimestamp()
            .setFooter(invite.inviter.username, invite.inviter.avatarURL);

          message.channel.send({embeds: [inviteEmbed]});
        });
      });
    } catch (err) {
      return sendError(`Please provide a valid invite link, like \`${guildPrefix}invfo https://discord.gg/PfgU2pnRda\``, message.channel);
    }
  }
};