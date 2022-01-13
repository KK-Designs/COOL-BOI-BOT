const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'ping',
	description: 'Ping! Returns the bots ping! 🏓',
	cooldown: 2,
	category: 'general',
	options: {},
	async execute(message) {
		const { client } = message;
		const embed = new MessageEmbed()
			.setTitle('<a:loading:808390866367545384> Pinging...')
			.setColor(message.channel.type === 'GUILD_TEXT' ? message.member.displayHexColor : '#FFB700');

		await message.reply({ embeds: [embed] }).then((msg) => {
			const pingembed = new MessageEmbed()
				.setTitle(`${client.user.username}'s Ping\n------------------------`)
				.addField('WS Latency:', `${Math.round(client.ws.ping)}ms`, true)
				.addField('API Latency (Round-trip):', `${msg.createdTimestamp - message.createdTimestamp}ms`)
				.setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
				.setTimestamp()
				.setColor(message.channel.type === 'GUILD_TEXT' ? message.guild.me.displayHexColor : '#FFB700');

			setTimeout(() => {
				msg.edit({ embeds: [pingembed] });
			}, Date.now() - message.createdTimestamp);
		});
	},
	/** @param {import("discord.js").CommandInteraction<"cached">} interaction */
	async executeSlash(interaction) {
		const embed = new MessageEmbed()
			.setTitle('<a:loading:808390866367545384> Pinging...')
			.setColor(interaction.member?.displayHexColor ?? '#FFB700');
		/** @type {import("discord.js").Message} */
		// eslint-disable-next-line no-extra-parens
		const reply = (await interaction.reply({ embeds: [embed], fetchReply: true }));
		const pingEmbed = new MessageEmbed()
			.setTitle(`${interaction.client.user.username}'s Ping\n------------------------`)
			.addField('WS Latency:', `${Math.round(interaction.client.ws.ping)}ms`, true)
			.addField('API Latency (Round-trip):', `${reply.createdTimestamp - interaction.createdTimestamp}ms`)
			.setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
			.setTimestamp()
			.setColor(interaction.guild?.me.displayHexColor ?? '#FFB700');

		await interaction.editReply({ embeds: [pingEmbed] });
	},
};