module.exports = {
	name: 'kick',
	description: 'Kicks the specified user with spcified reason!',
	guildOnly: true,
	usage: '[@user] (reason)',
	cooldown: 3,
	category: 'moderation',
	permissions: 'KICK_MEMBERS',
	clientPermissons: ['EMBED_LINKS', 'KICK_MEMBERS'],
	async execute(message, args) {
		const guild = message.guild;
		const user =
			message.mentions.users.first() ||
			message.guild.members.cache.get(args[0]);
		const { MessageEmbed } = require('discord.js');
		const sendError = require('../../error.js');

		if (!user) {
			return sendError(
				'Please provide a valid user for me to kick',
				message.channel,
			);
		}

		if (user.id === '811024409863258172') {
			return message.channel.send({
				content: 'You can\'t ban me!',
				reply: { messageReference: message.id },
			});
		}
		let reason = args.slice(1).join(' ');
		if (reason === '') {
			reason = 'No reason provided';
		}

		if (!user.bot) {
			const kickembeddm = new MessageEmbed()
				.setColor('#ffd45c')
				.setTitle('You were kicked')
				.setAuthor(
					message.author.username,
					message.author.displayAvatarURL({ dynamic: true }),
				)
				.addField('Kicked by: ', `${message.author.tag}`)
				.addField('Reason: ', `${reason.toString()}`)
				.addField('Server: ', `**${guild.name.toString()}**`)
				.setTimestamp()
				.setFooter('Kicked at:');

			user.send({ embeds: [kickembeddm] }).catch(console.error);
		}

		setTimeout(async () => {
			// Assuming we mention someone in the message, this will return the user
			// Read more about mentions over at https://discord.js.org/#/docs/main/master/class/MessageMentions
			const user = message.mentions.users.first();
			// If we have a user mentioned
			if (user) {
				// Now we get the member from the user
				const member = await message.guild.members.fetch(user);
				// If the member is in the guild
				if (member) {
					/**
					 * Kick the member
					 * Make sure you run this on a member, not a user!
					 * There are big differences between a user and a member
					 */
					message.guild.members
						.kick(user.id, { reason: reason })
						.then(() => {
							if (reason === '') {
								reason = 'No reason provided';
							}
							const kickembed = new MessageEmbed()
								.setColor('#940000')
								.setTitle('Member Kicked')
								.setAuthor(
									message.author.username,
									message.author.displayAvatarURL({ dynamic: true }),
								)
								.addField('User kicked: ', `${user.tag}`)
								.addField('Kicked by: ', '<@' + message.author.id + '>')
								.addField('Reason: ', `${reason}`)
								.setTimestamp()
								.setFooter('Kicked at:');

							// We let the message author know we were able to kick the person
							message.channel.send({ embeds: [kickembed] });
						})
						.catch((err) => {
							// An error happened
							// This is generally due to the bot not being able to kick the member,
							// either due to missing permissions or role hierarchy
							return sendError(
								'I was unable to kick that user. Check if I have the permision `KICK_MEMBERS`. If not that make my my role is higher than the member you are tying to kick.',
								message.channel,
							);
							// Log the error
							console.error(err);
						});
				}
				else {
					// The mentioned user isn't in this guild
					return message.channel.send({
						content: 'That user isn\'t in this guild!',
						reply: { messageReference: message.id },
					});
				}
				// Otherwise, if no user was mentioned
			}
			else {
				return message.channel.send({
					content: 'You didn\'t mention the user to kick!',
					reply: { messageReference: message.id },
				});
			}
		}, 1500);
	},
};
