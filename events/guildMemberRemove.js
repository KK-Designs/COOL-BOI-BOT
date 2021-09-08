module.exports = member => {
	const { MessageEmbed } = require('discord.js');
	const color = require('../color.json');
	const db = require('quick.db');
	const guild = member.guild;
	var modLogChannel = db.get('loggingchannel_' + guild.id);
	var modLogChannel = guild.channels.cache.get(modLogChannel);
	// member.send("Were sad you left <:Blob_disappointedface:753456000027197556> . But if you want to join back you can join using this link: https://discord.gg/wdjxthF");
	// Send the message to a designated channel on a server:
	var welcomeChannel = db.get('welcomechannel_' + member.guild.id);
	var welcomeChannel = member.guild.channels.cache.get(welcomeChannel);

	// Do nothing if the channel wasn't found on this server
	if (!welcomeChannel) return;
	// Send the message, mentioning the member
	welcomeChannel.send({ content: `${member} just left the server  :c` });

	if (!modLogChannel) return;
	if (member.bot) return;
	const embed = new MessageEmbed()
		.setAuthor('Member left', 'https://cdn.discordapp.com/emojis/812013459398983690.png')
		.setColor(color.bot_theme)
		.setDescription(`${member} left ${member.guild.name}`)
		.addField('Joined:', `${member.joinedAt.toDateString()}`, true)
		.addField('Account Created:', `${member.user.createdAt.toDateString()}`, true)
		.setFooter('COOL BOI BOT MEMBER LOGGING')
		.setTimestamp();
	modLogChannel.send({ embeds: [embed] }).catch();
	// we'll send to the welcome channel.

};