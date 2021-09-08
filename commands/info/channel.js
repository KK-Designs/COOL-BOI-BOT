module.exports = {
	name: 'channel',
	description: 'Gets the current or specified text channels info',
	guildOnly: true,
	usage: '(message, or #channel mentions, or channel id, or channel name)',
	cooldown: 3,
	category: 'info',
	clientPermissons: 'EMBED_LINKS',
	execute(message, args) {
		const { MessageEmbed } = require('discord.js');
		const humanizeDuration = require('humanize-duration');
		const channel =
            message.mentions.channels.first() ||
            message.guild.channels.cache.find(channel => channel.name === (args[0])) || message.guild.channels.cache.get(args[0]);

		if (!args[0]) {
			const channel = message.channel;
			const secondstoms = Math.floor(channel.rateLimitPerUser * 1000);
			let slowmode = humanizeDuration(secondstoms);

			if (secondstoms == 0) {
				slowmode = 'None';
			}
			const channelEmbed1 = new MessageEmbed()
				.setColor(message.guild.me.displayHexColor)
				.setTitle('<:text_channel:804772497185832963> Channel Info')
				.addField(':arrow_right: Name', channel.type === 'dm' ? `<@${channel.recipient.username}>` : `<#${channel.id}>`, true)
				.addField(':arrow_right: ID', channel.id, true)
				.addField(':arrow_right: Creation Date', channel.createdAt.toDateString(), true)
				.addField(':arrow_right: NSFW', channel.nsfw ? 'Yes' : 'No', true)
				.addField(':arrow_right: Slowmode', `${slowmode}`, true)
				.addField(':arrow_right: Category', channel.parent ? channel.parent.name : 'None', true)
				.addField(':arrow_right: Topic', channel.topic || 'None', true);

			return message.channel.send({ embeds: [ channelEmbed1 ], reply: { messageReference: message.id } });
		}
		if (!channel) {
			return message.channel.send({ content: 'please enter a valid channel.', reply: { messageReference: message.id } });
		}

		const secondstoms = Math.floor(channel.rateLimitPerUser * 1000);
		let slowmode = humanizeDuration(secondstoms);

		if (secondstoms == 0) {
			slowmode = 'None';
		}

		const channelEmbed = new MessageEmbed()
			.setColor(message.guild.me.displayHexColor)
			.setTitle('Channel Info')
			.addField(':arrow_right: Name', channel.type === 'dm' ? `<@${channel.recipient.username}>` : `<#${channel.id}>`, true)
			.addField(':arrow_right: ID', channel.id, true)
			.addField(':arrow_right: Creation Date', channel.createdAt.toDateString(), true)
			.addField(':arrow_right: NSFW', channel.nsfw ? 'Yes' : 'No', true)
			.addField(':arrow_right: Slowmode', `${slowmode}`, true)
			.addField(':arrow_right: Category', channel.parent ? channel.parent.name : 'None', true)
			.addField(':arrow_right: Topic', channel.topic || 'None', true);

		message.channel.send({ embeds: [ channelEmbed ], reply: { messageReference: message.id } });
	},
};