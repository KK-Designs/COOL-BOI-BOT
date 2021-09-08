module.exports = guild => {

	       let found = 0;
	guild.channels.cache.map((channel) => {
		if (found === 0) {
			if (channel.type === 'GUILD_TEXT') {
				if (channel.permissionsFor(guild.me).has('VIEW_CHANNEL') == true) {
					if (channel.permissionsFor(guild.me).has('SEND_MESSAGES') == true) {
						channel.send({ content: 'Hello and thanks for inviting me here! You can use `!help` to see all commands' });

						found = 1;
					}
				}
			}
		}
	});
};