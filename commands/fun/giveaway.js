const ms = require('ms');
const sendError = require('../../error.js');
module.exports = {
	name: 'giveaway',
	description: 'Manage giveaways for your server!',
	guildOnly: true,
	usage: 'edit/delete/reroll',
	aliases: ['g'],
	cooldown: 3,
	options: {
		create: {
			type: 'Subcommand',
			description: 'Create a new giveaway',
			options: {
				time: {
					type: 'String',
					description: 'The amount of time for this giveaway',
				},
				prize: {
					type: 'String',
					description: 'The prize for this giveaway',
				},
				winnercount: {
					type: 'Integer',
					description: 'The number of winners for this giveaway',
					required: false,
				},
			},
		},
		edit: {
			type: 'Subcommand',
			description: 'Edit an ongoing giveaway',
			options: {
				messageid: {
					type: 'String',
					description: 'The message id of the giveaway',
				},
				time: {
					type: 'String',
					description: 'The amount of time to add for this giveaway',
				},
				prize: {
					type: 'String',
					description: 'The prize for this giveaway',
				},
				winnercount: {
					type: 'Integer',
					description: 'The number of winners for this giveaway',
					required: false,
				},
			},
		},
		delete: {
			type: 'Subcommand',
			description: 'Delete a giveaway',
			options: {
				messageid: {
					type: 'String',
					description: 'The message id of the giveaway',
				},
			},
		},
		reroll: {
			type: 'Subcommand',
			description: 'Reroll a giveaway',
			options: {
				messageid: {
					type: 'String',
					description: 'The message id of the giveaway',
				},
			},
		},
	},
	async execute(message, args) {
		const { client } = message;

		if (args[0]?.toLowerCase() === 'reroll') {
			const messageID = args[1];
			if (!messageID) {return sendError('Please provide a valid message id', message.channel);}

			try {
				await client.giveawaysManager.reroll(messageID);
			}
			catch (err) {
				console.error(err);
				sendError('No giveaway found for ' + messageID + ', please check and try again', message.channel);
			}

			return message.delete();// message.channel.send('<:check:807305471282249738> Success! Giveaway rerolled!');
		}
		if (args[0]?.toLowerCase() === 'edit') {
			const messageID = args[1];
			if (!messageID) {return sendError('Please provide a valid message id', message.channel);}

			if (!args[2]) {return sendError('Please provide a valid time. like `5m`', message.channel);}

			if (!args.slice(3).join(' ')) {return sendError('Please provide a valid prize like `1 month nitro`', message.channel);}

			return client.giveawaysManager.edit(messageID, {
				newWinnerCount: 1,
				newPrize: args.slice(3).join(' '),
				addTime: ms(args[2]),
			}).then(() => {
				// here, we can calculate the time after which we are sure that the lib will update the giveaway
				const numberOfSecondsMax = client.giveawaysManager.options.updateCountdownEvery / 1000;

				message.channel.send({ content: '<:check:807305471282249738> Success! Giveaway will updated soon.' });
			}).catch((err) => {
				sendError('No giveaway found for ' + messageID + ', please check and try again', message.channel);
			});
		}
		if (args[0]?.toLowerCase() === 'delete') {
			const messageID = args[1];
			if (!messageID) {return sendError('Please provide a valid message id', message.channel);}

			return client.giveawaysManager.delete(messageID).then(() => {
				message.channel.send({ content: '<:check:807305471282249738> Success! Giveaway deleted!' });
			})
				.catch((err) => {
					message.channel.send({ content: 'No giveaway found for ' + messageID + ', please check and try again' });
				});
		}
		if (!args[0]) {return sendError('Please provide a valid time. like `5m`', message.channel);}

		if (!args[1]) {return sendError('Please provide a valid prize like `1 month nitro`', message.channel);}

		client.giveawaysManager.start(message.channel, {
			time: ms(args[0]),
			prize: args.slice(1).join(' '),
			winnerCount: parseInt(args[2]) || 1,
			embedColorEnd: 'RED',
			embedColor: 'GREEN',
			messages: {
				giveaway: '🎉 **GIVEAWAY** 🎉',
				giveawayEnded: '🎉 **GIVEAWAY ENDED** 🎉',
				timeRemaining: 'Time remaining: **{duration}**',
				inviteToParticipate: 'React with 🎉 to join!',
				winMessage: 'Congratulations, {winners}! You won **{prize}**!',
				embedFooter: 'Giveaways',
				noWinner: 'Giveaway cancelled, no valid participations.',
				hostedBy: 'Hosted by: {user}',
				winners: 'winner(s)',
				endedAt: 'Ended at',
				units: {
					seconds: 'seconds',
					minutes: 'minutes',
					hours: 'hours',
					days: 'days',
					pluralS: false, // Not needed, because units end with a S so it will automatically removed if the unit value is lower than 2
				},
			},
		}).then((gData) => {
			console.log(gData); // {...} (messageid, end date and more)
		});
	},
	async executeSlash(interaction) {
		const { client } = interaction;
		const subCmd = interaction.options.getSubcommand(true);

		switch (subCmd) {
		case 'create': {
			const time = ms(interaction.options.getString('time', true));
			const prize = interaction.options.getString('prize', true);
			const winnerCount = interaction.options.getInteger('winnercount') ?? 1;

			await interaction.deferReply();
			await client.giveawaysManager.start(interaction.channel, {
				time,
				prize,
				winnerCount,
				embedColorEnd: 'RED',
				embedColor: 'GREEN',
				messages: {
					giveaway: '🎉 **GIVEAWAY** 🎉',
					giveawayEnded: '🎉 **GIVEAWAY ENDED** 🎉',
					timeRemaining: 'Time remaining: **{duration}**',
					inviteToParticipate: 'React with 🎉 to join!',
					winMessage: 'Congratulations, {winners}! You won **{prize}**!',
					embedFooter: 'Giveaways',
					noWinner: 'Giveaway cancelled, no valid participations.',
					hostedBy: 'Hosted by: {user}',
					winners: 'winner(s)',
					endedAt: 'Ended at',
					units: {
						seconds: 'seconds',
						minutes: 'minutes',
						hours: 'hours',
						days: 'days',
						pluralS: false, // Not needed, because units end with a S so it will automatically removed if the unit value is lower than 2
					},
				},
			});
			await interaction.editReply('<:check:807305471282249738> Success! Giveaway created!');
		} break;
		case 'edit': {
			const messageID = interaction.options.getString('messageid', true);
			const time = interaction.options.getString('time', true);
			const prize = interaction.options.getString('prize', true);
			const winnerCount = interaction.options.getInteger('winnercount') ?? 1;

			await interaction.deferReply();
			try {
				await client.giveawaysManager.edit(messageID, {
					newWinnerCount: winnerCount,
					newPrize: prize,
					addTime: ms(time),
				});
			}
			catch (e) {
				if (typeof e !== 'string' || !e.startsWith('No giveaway found with message Id ')) {throw e;}

				return await interaction.editReply(`No giveaway found for ${messageID}, please check and try again`);
			}
			await interaction.editReply('<:check:807305471282249738> Success! Giveaway will updated soon.');
		} break;
		case 'delete': {
			const messageID = interaction.options.getString('messageid');

			try {
				await client.giveawaysManager.delete(messageID);
			}
			catch (e) {
				if (typeof e !== 'string' || !e.startsWith('No giveaway found with message Id ')) {throw e;}

				return await interaction.reply(`No giveaway found for ${messageID}, please check and try again`);
			}
			await interaction.reply({ content: '<:check:807305471282249738> Success! Giveaway deleted!' });
		} break;
		case 'reroll': {
			const messageID = interaction.options.getString('messageid');

			try {
				await client.giveawaysManager.reroll(messageID);
			}
			catch (e) {
				if (typeof e !== 'string' || !e.startsWith('No giveaway found with message Id ')) {throw e;}

				return await interaction.reply(`No giveaway found for ${messageID}, please check and try again`);
			}
			await interaction.reply({ content: '<:check:807305471282249738> Success! Giveaway rerolled!' });
		} break;
		}
	},
};