const Discord = require('discord.js');
const config = require('../config.json');
module.exports = async (client) => {
	const trim = (str) => (`${str.slice(0, 34)}**********************************`);
	const version = Discord.version;
	console.log(`Ready! Logged in as ${client.user.tag} with token of ${trim(client.token)}`);
	console.log(`© ${client.user.username} ${new Date().getFullYear()}`);
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
						name: ` !help | ${client.user.username}`,
						type: 'LISTENING',
					},
				],
				status: 'dnd',
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
				status: 'dnd',
			});
		}
	}, 15000);
	const user = await client.users.fetch(process.env.OWNER_ID);
	user.send('Bot is on <:check:807305471282249738>');
	// We set the webhook avatar URL here
	config.webhookAvatarURL = client.user.displayAvatarURL({ dynamic: true, format: 'png' });
};