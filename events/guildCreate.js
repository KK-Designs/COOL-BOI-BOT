/** @type {(...args: import("discord.js").ClientEvents["guildCreate"]) => Promise<any>} */
module.exports = async guild => {
	const channel = guild.channels.cache.find(
		c => c.type === 'GUILD_TEXT' && c.permissionsFor(guild.me).has(['VIEW_CHANNEL', 'SEND_MESSAGES']),
	);

	return await channel?.send({
		embeds: [{
			color: 'GREEN',
			description: '<:join:812013459298058260> Hello and thanks for inviting me here! You can use `!help` to see all commands',
		}],
	});
};