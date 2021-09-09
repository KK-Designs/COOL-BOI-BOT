module.exports = async client => {
	require('dotenv').config();
	const version = '13.1.0';
	console.log('Ready!');
	console.log('© COOL BOI BOT 2021');
	console.log(`v${version}`);
	setInterval(function() {
		client.user.setPresence({
			activities: [{
				name: ` !help | Serving ${client.guilds.cache.size} servers`,
				type: 'LISTENING',
			}],
		});
	}, 15000);

	const user = await client.users.fetch(process.env.OWNER_ID);
	user.send('Bot is on <:check:807305471282249738>');

	client.api.applications(client.user.id).commands.post({
		data: {
			name: 'ping',
			description: 'Pong!',
		},
	});

	client.api.applications(client.user.id).commands.post({
		data: {
			name: 'invite',
			description: 'Get the bot\'s invite link!',
		},
	});

	client.api.applications(client.user.id).commands.post({ data: {
		name: 'tips',
		description: 'Gives a tip of the bot!',
	} });

	client.api.applications(client.user.id).commands.post({ data: {
		name: 'yeet',
		description: 'Sends a picture of a yeet!',
	} });

	client.api.applications(client.user.id).commands.post({ data: {
		name: 'coinflip',
		description: 'Flips a coin!',
	} });

	client.api.applications(client.user.id).commands.post({ data: {
		name: 'diceroll',
		description: 'Rolls a dice! 🎲',
	} });

	client.api.applications(client.user.id).commands.post({ data: {
		name: '8ball',
		description: 'A magic 8ball command 🎱',
	} });

	client.api.applications(client.user.id).commands.post({ data: {
		name: 'advice',
		description: 'Gives a word of advice!',
	} });

	client.api.applications(client.user.id).commands.post({ data: {
		name: 'kill',
		description: 'Kills the mentioned user',
		options: [
			{
				'name': 'user',
				'description': 'The user to get',
				'type': 6, // 6 is type USER
				'required': true,
			},
		],
	} });

	client.api.applications(client.user.id).commands.post({ data: {
		name: 'simprate',
		description: 'Gets your or someone elses simprate!',
		options: [
			{
				'name': 'user',
				'description': 'The user to get',
				'type': 6, // 6 is type USER
				'required': true,
			},
		],
	} });

	client.api.applications(client.user.id).commands.get();
};