const {MessageEmbed} = require('discord.js');
const sendError = require("../../error.js");
module.exports = {
  name: 'ban',
  description: 'Bans the specified user with spcified reason! <:BAN:752937190786465894>',
  guildOnly: true,
  usage: '[@user] (reason)',
  cooldown: 5,
  category: 'moderation',
  permissions: 'BAN_MEMBERS',
  clientPermissons: ['EMBED_LINKS', 'BAN_MEMBERS'],
  options: {
    user: {
      type: "User",
      description: "The user to ban"
    },
    reason: {
      type: "String",
      description: "The reason for the ban",
      required: false
    }
  },
  async execute(message, args) {
    const user = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
    const guild = message.guild;
    
    if (!user)
      return sendError('Please provide a valid user for me to ban <:BAN:752937190786465894>', message.channel);

    if (user.id === '811024409863258172') {
      return message.reply({content: 'You can\'t ban me!'});
    }
    const reason = args.slice(1).join(' ') ?? "No reason provided";
    const banembeddm = new MessageEmbed()
      .setColor('#ffd45c')
      .setTitle(`You were banned <:BAN:752937190786465894>`)
      .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
    /*.addFields(
                      { name: 'Banned by: ', value: `<@${message.author.id.toString()}>`, inline: true },
                      { name: 'Reason: ', value: `${reason.toString()}`, inline: true },
                      { name: 'Server: ', value: `**${guild.name.toString()}**`, inline: true },
                    )*/
      .addField('Banned by: ', `<@${message.author.id.toString()}>`, true)
      .addField('Reason: ', `${reason.toString()}`, true)
      .addField('Server: ', `**${guild.name.toString()}**`, true)
      .setTimestamp()
      .setFooter('Banned at:');
    const member = await message.guild.members.fetch(user).catch(() => null);

    if (!member)
      return message.reply({content: "That user isn't in this guild!"});

    
    if (!member.bannable)
      return message.reply(
        'I was unable to ban that user. Check if I have the permision `BAN_MEMBERS`. If not that make sure my role is higher than the member you are tying to ban <:BAN:752937190786465894>.'
      );
    
    if (!user.bot) {
      user.send({embeds: [banembeddm]});
    }
    // Now we get the member from the user
    // If the member is in the guild
    /**
     * Ban the member
     * Make sure you run this on a member, not a user!
     * There are big differences between a user and a member
     * Read more about what ban options there are over at
     * https://discord.js.org/#/docs/main/master/class/GuildMember?scrollTo=ban
     */
    await message.guild.members.ban(user.id, {reason: reason});
    const banembed = new MessageEmbed()
      .setColor('#940000')
      .setTitle('Member Banned <:BAN:752937190786465894>')
      .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
      .addField('User banned: ', `${user}`)
      .addField('Banned by: ', `${message.author}`)
      .addField('Reason: ', `${reason}`)
      .setTimestamp()
      .setFooter('Banned at:');

    // We let the message author know we were able to ban the person
    message.channel.send({embeds: [banembed]});
  },
  async executeSlash(interaction) {
    const member = interaction.options.getMember("user", true);
    const reason = interaction.options.getString("reason") ?? "No reason provided";
    const guild = interaction.guild;

    if (member.id === '811024409863258172') {
      return await interaction.reply({content: 'You can\'t ban me!'});
    }
    if (!member.bannable) {
      return await interaction.reply({
        content: 'I was unable to ban that user. Check if I have the permision `BAN_MEMBERS`. If not that make sure my role is higher than the member you are tying to ban <:BAN:752937190786465894>.'
      });
    }
    if (!member.user.bot) {
      const banembeddm = new MessageEmbed()
        .setColor('#ffd45c')
        .setTitle(`You were banned <:BAN:752937190786465894>`)
        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({dynamic: true}))
      /*.addFields(
                      { name: 'Banned by: ', value: `<@${message.author.id.toString()}>`, inline: true },
                      { name: 'Reason: ', value: `${reason.toString()}`, inline: true },
                      { name: 'Server: ', value: `**${guild.name.toString()}**`, inline: true },
                    )*/
        .addField('Banned by: ', `${interaction.user}`, true)
        .addField('Reason: ', `${reason}`, true)
        .addField('Server: ', `**${guild.name}**`, true)
        .setTimestamp()
        .setFooter('Banned at:');

      await member.send({embeds: [banembeddm]}).catch(() => console.warn(`${member} has dms disabled`));
    }
    /**
       * Ban the member
       * Make sure you run this on a member, not a user!
       * There are big differences between a user and a member
       * Read more about what ban options there are over at
       * https://discord.js.org/#/docs/main/master/class/GuildMember?scrollTo=ban
       */
    await guild.ban(member.id, {reason: reason});
    const banembed = new MessageEmbed()
      .setColor('#940000')
      .setTitle('Member Banned <:BAN:752937190786465894>')
      .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({dynamic: true}))
      .addField('User banned: ', `${member}`)
      .addField('Banned by: ', `${interaction.user}`)
      .addField('Reason: ', `${reason}`)
      .setTimestamp()
      .setFooter('Banned at:');

    // We let the message author know we were able to ban the person
    await interaction.reply({embeds: [banembed]});
  }
};