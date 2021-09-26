const qdb = require('quick.db');
const giveaways = new qdb.table('giveaways');
/** @type {oldGiveawayObject[]} */
const arr = JSON.parse(qdb.get('giveaways'));

console.log('Migrating giveaways, found %d', arr.length);
for (const { messageID, guildID, channelID, ...giveaway } of arr) {
	/** @type {newGiveawayObject} */
	const reformatted = {
		messageId: messageID,
		guildId: guildID,
		channelId: channelID,
		...giveaway,
	};

	giveaways.set(messageID, reformatted);
}
qdb.delete('giveaways');
/**
 * @typedef {Object} baseGiveawayObject
 * @prop {number} startAt
 * @prop {number?} endAt
 * @prop {boolean} ended
 * @prop {number} winnerCount
 * @prop {string[]} winners
 * @prop {string} prize
 * @prop {Object} messages
 * @prop {string} messages.giveaway
 * @prop {string} messages.giveawayEnded
 * @prop {string} messages.inviteToParticipate
 * @prop {string} messages.timeRemaining
 * @prop {string} messages.winMessage
 * @prop {string} messages.embedFooter
 * @prop {string} messages.noWinner
 * @prop {string} messages.winners
 * @prop {string} messages.endedAt
 * @prop {string} messages.hostedBy
 * @prop {Object} messages.units
 * @prop {string} messages.units.seconds
 * @prop {string} messages.units.minutes
 * @prop {string} messages.units.hours
 * @prop {string} messages.units.days
 * @prop {boolean} messages.units.pluralS
 */
/**
 * @typedef { {
 *  messageID: string,
 *  channelID: string,
 *  guildID: string
 * } & baseGiveawayObject} oldGiveawayObject
 */
/**
 * @typedef { {
 *  messageId: string,
 *  channelId: string,
 *  guildId: string
 * } & baseGiveawayObject} newGiveawayObject
 */