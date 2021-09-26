const { MessageEmbed } = require('discord.js');
const humanizeDuration = require('humanize-duration');
module.exports = {
	name: 'channel',
	description: 'Gets the current or specified text channels info',
	guildOnly: true,
	usage: '(message, or #channel mentions, or channel id, or channel name)',
	cooldown: 3,
	category: 'info',
	clientPermissons: 'EMBED_LINKS',
	options: {
		channel: {
			type: 'Channel',
			description: 'The channel to get the info of',
			required: false,
		},
	},
	async execute(message, args) {
		const channel = args[0]
			? message.mentions.channels.first()
        || message.guild.channels.cache.find(c => c.name === args[0]) || message.guild.channels.cache.get(args[0])
			: message.channel;

		if (!channel) {
			return message.reply({ content: 'please enter a valid channel.' });
		}
		const secondstoms = Math.floor(channel.rateLimitPerUser * 1000);
		let slowmode = humanizeDuration(secondstoms);
		if (secondstoms === 0) {
			slowmode = 'None';
		}
		const channelEmbed = new MessageEmbed()
			.setColor(message.guild.me.displayHexColor)
			.setTitle('Channel Info')
			.addField(':arrow_right: Name', channel.type === 'DM' ? `<@${channel.recipient.username}>` : `<#${channel.id}>`, true)
			.addField(':arrow_right: ID', channel.id, true)
			.addField(':arrow_right: Creation Date', channel.createdAt.toDateString(), true)
			.addField(':arrow_right: NSFW', channel.nsfw ? 'Yes' : 'No', true)
			.addField(':arrow_right: Slowmode', `${slowmode}`, true)
			.addField(':arrow_right: Category', channel.parent ? channel.parent.name : 'None', true)
			.addField(':arrow_right: Topic', channel.topic || 'None', true);

		message.reply({ embeds: [channelEmbed] });
	},
	async executeSlash(interaction) {
		const channel = interaction.options.getChannel('channel') ?? interaction.channel;
		const secondstoms = Math.floor(channel.rateLimitPerUser * 1000);
		const slowmode = secondstoms === 0
			? humanizeDuration(secondstoms)
			: 'None';
		const channelEmbed = new MessageEmbed()
			.setColor(interaction.guild.me.displayHexColor)
			.setTitle('Channel Info')
			.addField(':arrow_right: Name', channel.type === 'DM' ? `<@${channel.recipient.username}>` : `<#${channel.id}>`, true)
			.addField(':arrow_right: ID', channel.id, true)
			.addField(':arrow_right: Creation Date', channel.createdAt.toDateString(), true)
			.addField(':arrow_right: NSFW', channel.nsfw ? 'Yes' : 'No', true)
			.addField(':arrow_right: Slowmode', `${slowmode}`, true)
			.addField(':arrow_right: Category', channel.parent ? channel.parent.name : 'None', true)
			.addField(':arrow_right: Topic', channel.topic || 'None', true);

		await interaction.reply({ embeds: [channelEmbed] });
	},
};