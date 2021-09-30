const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'ping',
	description: 'Ping! Returns the bots ping! 🏓',
	cooldown: 2,
	category: 'general',
	options: {},
	async execute(message, client) {
		const embed = new MessageEmbed()
			.setTitle('Pinging...')
			.setColor(message.channel.type === 'GUILD_TEXT' ? message.member.displayHexColor : '#FFB700');

		message.reply({ embeds: [embed] }).then((msg) => {
			const pingembed = new MessageEmbed()
				.setTitle(`${client.user.username}'s Ping\n------------------------`)
				.addField('WS Latency:', `${Math.round(client.ws.ping)}ms`, true)
				.addField('API Latency (Round-trip):', `${msg.createdTimestamp - message.createdTimestamp}ms`)
				.setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
				.setTimestamp()
				.setColor(message.channel.type === 'GUILD_TEXT' ? message.guild.me.displayHexColor : '#FFB700');

			setTimeout(() => {
				msg.edit({ embeds: [pingembed] });
			}, Date.now() - message.createdTimestamp);
		});
	},
	/** @param {CommandInteraction & { member: GuildMember }} interaction */
	async executeSlash(interaction) {
		const embed = new MessageEmbed()
			.setTitle('Pinging...')
			.setColor(interaction.member?.displayHexColor ?? '#FFB700');
		/** @type {Message} */
		// eslint-disable-next-line no-extra-parens
		const reply = (await interaction.reply({ embeds: [embed], fetchReply: true }));
		const pingEmbed = new MessageEmbed()
			.setTitle(`${interaction.client.user.username}'s Ping\n------------------------`)
			.addField('WS Latency:', `${Math.round(interaction.client.ws.ping)}ms`, true)
			.addField('API Latency (Round-trip):', `${reply.createdTimestamp - interaction.createdTimestamp}ms`)
			.setFooter(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
			.setTimestamp()
			.setColor(interaction.guild?.me.displayHexColor ?? '#FFB700');

		await interaction.editReply({ embeds: [pingEmbed] });
	},
};