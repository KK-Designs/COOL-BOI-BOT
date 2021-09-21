const qdb = require('quick.db');
// Requires Manager from discord-giveaways
const {
  GiveawaysManager
} = require('discord-giveaways');
module.exports = async client => {
  // Starts updating currents giveaways
  // Load quick.db - it's an example of custom database, you can use MySQL, PostgreSQL, etc...
  class GiveawayManagerWithOwnDatabase extends GiveawaysManager {
    /**
     *
     * @param {import("discord.js").Client} c
     * @param {import("discord-giveaways").GiveawaysManagerOptions} options
     */
    constructor(c, options) {
      super(c, options, false);
      this.db = new qdb.table("giveaways");
      super._init();
    }
    // This function is called when the manager needs to get all the giveaway stored in the database.
    getAllGiveaways() {
    // Get all the giveaway in the database
      const data = this.db.fetchAll();

      return data.map((obj) => JSON.parse(obj.data));
    }

    // This function is called when a giveaway needs to be saved in the database (when a giveaway is created or when a giveaway is edited).
    saveGiveaway(messageID, giveawayData) {
      this.db.set(messageID, giveawayData);

      // Don't forget to return something!
      return true;
    }

    editGiveaway(messageID, giveawayData) {
      this.db.set(messageID, giveawayData);

      // Don't forget to return something!
      return true;
    }

    // This function is called when a giveaway needs to be deleted from the database.
    deleteGiveaway(messageID) {
      this.db.delete(messageID);

      // Don't forget to return something!
      return Promise.resolve(true);
    }
  }
  // Create a new instance of your new class
  const manager = new GiveawayManagerWithOwnDatabase(client, {
    storage: './giveaways.json',
    updateCountdownEvery: 10000,
    //hasGuildMembersIntent: false,
    default: {
      botsCanWin: false,
      exemptPermissions: ['MANAGE_MESSAGES', 'ADMINISTRATOR'],
      embedColor: '#FF0000',
      reaction: '🎉'
    }
  });

  // We now have a giveawaysManager property to access the manager everywhere!
  client.giveawaysManager = manager;
  const reqEvent = (event) => require(`./events/${event}`);

  manager.on('giveawayEnded', reqEvent('giveawayEnded'));
  manager.on('giveawayReactionAdded', reqEvent('giveawayReactionAdded'));


};