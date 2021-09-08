module.exports = {
	name: 'giveaway',
	description: 'Manage giveaways for your server!',
	guildOnly: true,
	usage: 'edit/delete/reroll',
	aliases: ['g'],
	cooldown: 3,
	execute(message, args, client) {
		const ms = require('ms');
		const sendError = require('../../error.js');

		if (args.length) {
			if (args[0].toLowerCase() === 'reroll') {
				const messageID = args[1];
				if (!messageID) return sendError('Please provide a valid message id', message.channel);
				client.giveawaysManager.reroll(messageID).then(() => {
					return message.delete();// message.channel.send('<:check:807305471282249738> Success! Giveaway rerolled!');
				}).catch((err) => {
					return sendError('No giveaway found for ' + messageID + ', please check and try again', message.channel);
				});
			}

			if (args[0].toLowerCase() === 'edit') {
				const messageID = args[1];
				if (!messageID) return sendError('Please provide a valid message id', message.channel);
				if (!args[2]) return sendError('Please provide a valid time. like `5m`', message.channel);
				if (!args.slice(3).join(' ')) return sendError('Please provide a valid prize like `1 month nitro`', message.channel);
				client.giveawaysManager.edit(messageID, {
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

			if (args[0].toLowerCase() === 'delete') {
				const messageID = args[1];
				if (!messageID) return sendError('Please provide a valid message id', message.channel);
				client.giveawaysManager.delete(messageID).then(() => {
					message.channel.send({ content: '<:check:807305471282249738> Success! Giveaway deleted!' });
				})
					.catch((err) => {
						message.channel.send({ content: 'No giveaway found for ' + messageID + ', please check and try again' });
					});
			}

		}
		if (!args[0]) return sendError('Please provide a valid time. like `5m`', message.channel);
		if (!args.slice(1).join(' ')) return sendError('Please provide a valid prize like `1 month nitro`', message.channel);


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
};