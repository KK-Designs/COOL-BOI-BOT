const Discord = require('discord.js');
const deployCommands = require('../deploy');
module.exports = async client => {
	const version = Discord.version;

	console.log('Ready!');
	console.log('© COOL BOI BOT 2021');
	console.log(`v${version}`);
	/* setInterval(function() {
    client.user.setPresence({
      activities: [{
        name: ` !help | Serving ${client.guilds.cache.size} servers`,
        type: 'LISTENING',
      }],
      });
    }, 15000);*/

	// client.api.applications(client.user.id).commands('824001418670505984').delete()

};