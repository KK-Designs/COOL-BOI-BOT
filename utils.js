const Discord = require('discord.js');
module.exports = {
	async getAvatarColor(user, client) {
		if (user.bot) return;
		await client.users.fetch(user.id).then(member => {
			console.log(member);
			const getColors = require('get-image-colors');
			if (!member) {
				throw new Error('INVALID args\nPlease provide a valid argument for user');
			}
			getColors(member.displayAvatarURL({ format: 'png' })).then(colors => {
				if (colors.map(color => color.hex()).length == 0) {
					return console.error(`No colors found for ${member.displayAvatarURL({ format: 'png' })}`);
				}
				return colors.map(color => color.hex())[0].toString();
			});
		});
	},

	isBot(message) {
		if (!message) {
			throw new Error('INVALID args\nPlease provide a valid argument for message');
		}
		if (message.partial) {
			throw new Error('PARTIAL MESSAGE\n The message was a partial message and thus could not be parsed');
		}
		if (message.author.bot == true) {
			return true;
		}
		else if (message.author.bot == false) {
			return true;
		}
	},
	isPartial(message) {
		if (message) {
			throw new Error('INVALID args\nPlease provide a valid argument for message');
		}
		if (message.partial == true) {
			return true;
		}
		else if (message.partial == false) {
			return false;
		}
	},
	getUserFromMention(mention) {
		if (!mention) throw new Error('INVALID args\nPlease provide a valid argument for mention');

		if (mention.startsWith('<@') && mention.endsWith('>')) {
			mention = mention.slice(2, -1);

			if (mention.startsWith('!')) {
				mention = mention.slice(1);
			}

			return client.users.cache.get(mention);
		}
	},
	getUserIdFromMention(mention) {
		// The id is the first and only match found by the RegEx.
		const matches = mention.match(/^<@!?(\d+)>$/);

		// If supplied variable was not a mention, matches will be null instead of an array.
		if (!matches) throw new Error('INVALID args\nPlease provide a valid argument for mention');

		// However, the first element in the matches array will be the entire mention, not just the ID,
		// so use index 1.
		const id = matches[1];

		return id;
	},
};
