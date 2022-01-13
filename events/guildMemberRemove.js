module.exports = async (member) => {
	const { getLogChannel } = require('../utils.js');
	const { getWelcomeChannel } = require('../utils.js');
	const { MessageEmbed } = require('discord.js');
	const color = require('../color.json');
	const db = require('quick.db');
	const guild = member.guild;

	// Do nothing if the channel wasn't found on this server
	if (!getWelcomeChannel(member.guild, db)) return;
	// Send the message, mentioning the member
	getWelcomeChannel(member.guild, db).send({
		content: `${member.user.tag} just left the server  :c`,
	});

	if (!getLogChannel(member.guild, db)) return;
	if (member.bot) return;
	const embed = new MessageEmbed()
		.setAuthor(
			'Member left',
			'https://cdn.discordapp.com/emojis/812013459398983690.png',
		)
		.setColor(color.bot_theme)
		.setDescription(`${member.user.tag} left ${member.guild.name}`)
		.addField('Joined:', `${member.joinedAt.toDateString()}`, true)
		.addField(
			'Account Created:',
			`${member.user.createdAt.toDateString()}`,
			true,
		)
		.setFooter('COOL BOI BOT MEMBER LOGGING')
		.setTimestamp();

	const webhooks = await getLogChannel(member.guild, db).fetchWebhooks();
	const webhook = webhooks.first();

	await webhook.send({
		username: 'COOL BOI BOT Logging',
		avatarURL:
			'https://cdn.discordapp.com/avatars/811024409863258172/f67bc2b8f122599864b02156cd67564b.png',
		embeds: [embed],
	});
	// we'll send to the welcome channel.
};
