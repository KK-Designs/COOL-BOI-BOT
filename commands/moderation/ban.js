module.exports = {
	name: 'ban',
	description: 'Bans the specified user with spcified reason! <:BAN:752937190786465894>',
	guildOnly: true,
	usage: '[@user] (reason)',
	cooldown: 5,
	category: 'moderation',
	permissions: 'BAN_MEMBERS',
	clientPermissons: ['EMBED_LINKS', 'BAN_MEMBERS'],
	execute(message, args) {
		const sendError = require('../../error.js');
		const user = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
		const guild = message.guild;
		const { MessageEmbed } = require('discord.js');

		if (!user) return sendError('Please provide a valid user for me to ban <:BAN:752937190786465894>', message.channel);

		if (user.id === '811024409863258172') {
			return message.channel.send({ content: 'You can\'t ban me!', reply: { messageReference: message.id } });
		}
		let reason = args.slice(1).join(' ');
		if (reason === '') {
			reason = 'No reason provided';
		}
		const banembeddm = new MessageEmbed()
			.setColor('#ffd45c')
			.setTitle('You were banned <:BAN:752937190786465894>')
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
		/* .addFields(
                      { name: 'Banned by: ', value: `<@${message.author.id.toString()}>`, inline: true },
                      { name: 'Reason: ', value: `${reason.toString()}`, inline: true },
                      { name: 'Server: ', value: `**${guild.name.toString()}**`, inline: true },
                    )*/
			.addField('Banned by: ', `<@${message.author.id.toString()}>`, true)
			.addField('Reason: ', `${reason.toString()}`, true)
			.addField('Server: ', `**${guild.name.toString()}**`, true)
			.setTimestamp()
			.setFooter('Banned at:');
		if (!user.bot) {
			user.send({ embeds: [banembeddm] });
		}
		setTimeout(() => {
			// Assuming we mention someone in the message, this will return the user
			// Read more about mentions over at https://discord.js.org/#/docs/main/master/class/MessageMentions
			const user = message.mentions.users.first();

			// If we have a user mentioned
			if (user) {
				// Now we get the member from the user
				const member = message.guild.members.fetch(user);
				// If the member is in the guild
				if (member) {
					/**
               * Ban the member
               * Make sure you run this on a member, not a user!
               * There are big differences between a user and a member
               * Read more about what ban options there are over at
               * https://discord.js.org/#/docs/main/master/class/GuildMember?scrollTo=ban
               */

					message.guild.members.ban(user.id, { reason: reason })
						.then(() => {
							if (reason === '') {
								reason = 'No reason provided';
							}
							const banembed = new MessageEmbed()
								.setColor('#940000')
								.setTitle('Member Banned <:BAN:752937190786465894>')
								.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
								.addField('User banned: ', '<@' + message.mentions.users.first().id.toString() + '>')
								.addField('Banned by: ', `<@${message.author.id.toString()}>`)
								.addField('Reason: ', `${reason.toString()}`)
								.setTimestamp()
								.setFooter('Banned at:');
							// We let the message author know we were able to ban the person
							message.channel.send({ embeds: [banembed] });
						})
						.catch(err => {
							// An error happened
							// This is generally due to the bot not being able to ban the member,
							// either due to missing permissions or role hierarchy
							message.channel.send({ content: 'I was unable to ban that user. Check if I have the permision `BAN_MEMBERS`. If not that make sure my role is higher than the member you are tying to ban <:BAN:752937190786465894>.', reply: { messageReference: message.id } });
							// Log the error
							console.error(err);
						});
				}
				else {
					// The mentioned user isn't in this guild
					message.channel.send({ content: 'That user isn\'t in this guild!', reply: { messageReference: message.id } });
				}
			}
			else {
				// Otherwise, if no user was mentioned
				message.channel.send({ content: 'You didn\'t mention the user to ban!', reply: { messageReference: message.id } });
			}
		}, 1500);
	},
};