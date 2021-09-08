module.exports = (interaction, client) => {
	try {
		const command = interaction.data.name.toLowerCase();
		const args = interaction.data.options;

		if (command === 'ping') {
			// here you could do anything. in this sample
			// i reply with an api interaction
			client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						content: `🏓 Pong! Ping is ${Math.round(client.ws.ping)}ms`,
					},
				},
			});

		}

		if (command === 'invite') {
			// here you could do anything. in this sample
			// i reply with an api interaction
			client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						content: `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=3728080855&scope=bot%20applications.commands`,
					},
				},
			});
		}
	}
	catch (err) {
		console.log(err);
	}
};