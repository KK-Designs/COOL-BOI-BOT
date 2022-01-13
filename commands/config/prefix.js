module.exports = {
	name: 'prefix',
	description: 'Get the bots prefix! ***This command prefix is always `!` ***',
	cooldown: 2,
	guildOnly: true,
	category: 'config',
	clientPermissons: 'EMBED_LINKS',
	permissons: 'ADMINISTRATOR',
	execute(message, args) {
		const prefix = require('discord-prefix');
		const color = require('../../color.json');
		const guildPrefix = prefix.getPrefix(
			message.channel.type === 'dm' ? message.author.id : message.guild.id,
		);
		const { MessageEmbed } = require('discord.js');

		const embed = new MessageEmbed()
			.setTitle(`The bots prefix is ${guildPrefix == null ? '!' : guildPrefix}`)
			.setColor(
				message.channel.type === 'dm'
					? color.discord
					: message.guild.me.displayHexColor,
			)
			.setThumbnail(
				'https://images-ext-2.discordapp.net/external/PtRqDuS2wA-2WgNWTTLOwbG-B6ioUW6YPiRtxgs4ap4/https/cdn.discordapp.com/avatars/769415264306987068/699aa52d1dd597538fc33ceef502b1e6.webp',
			)
			.setDescription('This command prefix is always `!` or a @mention')
			.setFooter(
				message.author.username,
				message.author.displayAvatarURL({ dynamic: true }),
			)
			.setTimestamp();
		message.channel.send({
			embeds: [embed],
			reply: { messageReference: message.id },
		});
	},
};
