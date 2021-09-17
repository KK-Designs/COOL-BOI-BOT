module.exports = {
	getUserFromMention(mention, clien5) {
		if (!mention) throw new Error('INVALID args\nPlease provide a valid argument for mention');

		if (mention.startsWith('<@') && mention.endsWith('>')) {
			mention = mention.slice(2, -1);

			if (mention.startsWith('!')) {
				mention = mention.slice(1);
			}

			return client.users.cache.get(mention);
		}
	},
	getLogChannel(guild, db) {
		if (!guild?.id) throw new Error(`Parameter ${guild ? guild : 'null'} is not valid`);
		if (!db) throw new Error(`Parameter ${db ? db : 'null'} is not valid`);
		const getModLogChannel = db.get('loggingchannel_' + guild.id);
		const modLogChannel = guild.channels.cache.get(getModLogChannel);
		return modLogChannel;
	},
	getWelcomeChannel(guild, db) {
		if (!guild?.id) throw new Error(`Parameter ${guild ? guild : 'null'} is not valid`);
		if (!db) throw new Error(`Parameter ${db ? db : 'null'} is not valid`);
		const getWelcomeChannel = db.get('welcomechannel_' + guild.id);
		const welcomeChannel = guild.channels.cache.get(getWelcomeChannel);
		return welcomeChannel;
	},
};
