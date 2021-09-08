module.exports = async client => {
	const db = require('quick.db');
	// Requires Manager from discord-giveaways
	const {
		GiveawaysManager,
	} = require('discord-giveaways');
	// Starts updating currents giveaways
	// Load quick.db - it's an example of custom database, you can use MySQL, PostgreSQL, etc...
	if (!db.get('giveaways')) db.set('giveaways', []);

	const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
		// This function is called when the manager needs to get all the giveaway stored in the database.
		async getAllGiveaways() {
			// Get all the giveaway in the database
			return db.get('giveaways');
		}

		// This function is called when a giveaway needs to be saved in the database (when a giveaway is created or when a giveaway is edited).
		async saveGiveaway(messageID, giveawayData) {
			// Add the new one
			db.push('giveaways', giveawayData);
			// Don't forget to return something!
			return true;
		}

		async editGiveaway(messageID, giveawayData) {
			// Gets all the current giveaways
			const giveaways = db.get('giveaways');
			// Remove the old giveaway from the current giveaways ID
			const newGiveawaysArray = giveaways.filter((giveaway) => giveaway.messageID !== messageID);
			// Push the new giveaway to the array
			newGiveawaysArray.push(giveawayData);
			// Save the updated array
			db.set('giveaways', newGiveawaysArray);
			// Don't forget to return something!
			return true;
		}

		// This function is called when a giveaway needs to be deleted from the database.
		async deleteGiveaway(messageID) {
			// Remove the giveaway from the array
			const newGiveawaysArray = db.get('giveaways').filter((giveaway) => giveaway.messageID !== messageID);
			// Save the updated array
			db.set('giveaways', newGiveawaysArray);
			// Don't forget to return something!
			return true;
		}
	};

	// Create a new instance of your new class
	const manager = new GiveawayManagerWithOwnDatabase(client, {
		storage: './giveaways.json',
		updateCountdownEvery: 10000,
		hasGuildMembersIntent: false,
		botsCanWin: false,
		exemptPermissions: ['MANAGE_MESSAGES', 'ADMINISTRATOR'],
		embedColor: '#FF0000',
		reaction: '🎉',

	});
	// We now have a giveawaysManager property to access the manager everywhere!
	client.giveawaysManager = manager;

	const reqEvent = (event) => require(`./events/${event}`);

	manager.on('giveawayEnded', reqEvent('giveawayEnded'));

	manager.on('giveawayReactionAdded', reqEvent('giveawayReactionAdded'));


};