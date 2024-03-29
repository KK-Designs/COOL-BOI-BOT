const { MessageEmbed } = require('discord.js');
const { getLogChannel, getWelcomeChannel } = require('../utils');
const color = require('../color.json');
const db = require('quick.db');
const config = require('../config.json');
module.exports = async member => {

	const guild = member.guild;
	const { client } = member.guild;
	const welcomeChannel = getWelcomeChannel(guild, db);

	// Do nothing if the channel wasn't found on this server
	if (!welcomeChannel) return;

	// Send the message, mentioning the member
	welcomeChannel.send({ content: `${member.user.tag} just left the server  :c` });
	const logChannel = getLogChannel(member.guild, db);

	if (!logChannel) return;

	if (member.user.bot) return;

	const embed = new MessageEmbed()
		.setAuthor({ name: 'Member left', iconURL: 'https://cdn.discordapp.com/emojis/812013459398983690.png' })
		.setColor(color.bot_theme)
		.setDescription(`${member.user.tag} left ${member.guild.name}`)
		.addField('Account Created', `<t:${Math.floor(member.user.createdTimestamp / 1000)}:f>`, true)
		.addField('Joined Server', `<t:${Math.floor(member.joinedTimestamp / 1000)}:f>`, true)
		.setFooter({ text: `${client.user.username} MEMBER LOGGING` })
		.setTimestamp();
	const webhooks = await logChannel.fetchWebhooks();
	const webhook = webhooks.find(wh => wh.token);

	await webhook.send({
		username: `${client.user.username} Logging`,
		avatarURL: config.webhookAvatarURL,
		embeds: [embed],
	});
	// we'll send to the welcome channel.
};
