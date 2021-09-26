const Discord = require('discord.js');
module.exports = async (client) => {
	const trim = (str) => (`${str.slice(0, 34)}**********************************`);
	const version = Discord.version;

	console.log(`Ready! Logged in as ${client.user.tag} with  token of ${trim(client.token)}`);
	console.log('© COOL BOI BOT 2021');
	console.log(`v${version}`);
	const status = [
		'status 1',
		'status 2',
	];
	setInterval(function() {
		const index = Math.floor(Math.random() * Math.floor(status.length));
		if (status[index] === 'status 1') {
			client.user.setPresence({
				activities: [
					{
						name: ' !help | Expirimental COOL BOI BOT',
						type: 'LISTENING',
					},
				],
			});
		}
		else {
			client.user.setPresence({
				activities: [
					{
						name: ' !help | Almost done with experimental features!',
						type: 'LISTENING',
					},
				],
			});
		}
	}, 15000);
	const user = await client.users.fetch(process.env.OWNER_ID);
	user.send('Bot is on <:check:807305471282249738>');
};