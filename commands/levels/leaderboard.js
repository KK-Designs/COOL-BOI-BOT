const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const { bold, inlineCode } = require('@discordjs/builders');
const color = require('../../color.json');
module.exports = {
	name: 'leaderboard',
	description: 'Gets the top 10 member\'s leader board',
	aliases: ['lb'],
	cooldown: 3,
	category: 'levels',
	guildOnly: true,
	options: {},
	async execute(message) {
		const { client } = message;
		let rankMemberData = [];
		message.guild.members.fetch().then(async members => {
			members.array().map(async m => {
				if (m.user.bot) return;
				const level = await db.fetch(`level_${m.guild.id}_${m.user.id}`) ?? 1;
				let totalMessages = db.fetch(`messagesneeded_${m.guild.id}_${m.user.id}`) ?? 0;
				const messagesNeeded = 50 + 50 * (level - 1) + Math.floor((level - 1) / 3) * 25;
				totalMessages = Math.abs(messagesNeeded - totalMessages);
				rankMemberData.push({
					member: m,
					level: isNaN(Number(`${level}.${percentage(messagesNeeded, totalMessages)}`)) ? 0 : Number(`${level}.${percentage(messagesNeeded, totalMessages)}`),
				});
				rankMemberData = rankMemberData.slice(0, message.guild.memberCount >= 10 ? 10 : rankMemberData.length);
				return rankMemberData.sort((a, b) => b.level - a.level);
			});
		}).then(async () => {
			rankMemberData.sort((a, b) => b.level - a.level);
			rankMemberData = rankMemberData.slice(0, message.guild.memberCount >= 10 ? 10 : rankMemberData.length);
			const leaderboard = `${rankMemberData[0]?.member.user.tag ? `🥇 ${bold(rankMemberData[0]?.member.user.tag)}` : ''} ${(rankMemberData[0]?.level.toFixed() == 0 ? 1 : rankMemberData[0]?.level.toFixed()) ? `• Level: ${inlineCode(rankMemberData[0]?.level.toFixed() == 0 ? 1 : rankMemberData[0]?.level.toFixed())}` : ''}\n${rankMemberData[1]?.member.user.tag ? `🥈 ${bold(rankMemberData[1]?.member.user.tag)}` : ''} ${(rankMemberData[1]?.level.toFixed() == 0 ? 1 : rankMemberData[1]?.level.toFixed()) ? `• Level: ${inlineCode(rankMemberData[1]?.level.toFixed() == 0 ? 1 : rankMemberData[1]?.level.toFixed())}` : ''}\n${rankMemberData[2]?.member.user.tag ? `🥉 ${bold(rankMemberData[2]?.member.user.tag)}` : ''} ${(rankMemberData[2]?.level.toFixed() == 0 ? 1 : rankMemberData[2]?.level.toFixed()) ? `• Level: ${inlineCode(rankMemberData[2]?.level.toFixed() == 0 ? 1 : rankMemberData[2]?.level.toFixed())}` : ''}\n${rankMemberData[3]?.member.user.tag ? `4️⃣ ${rankMemberData[3]?.member.user.tag}` : ''} ${(rankMemberData[3]?.level.toFixed() == 0 ? 1 : rankMemberData[3]?.level.toFixed()) ? `• Level: ${inlineCode(rankMemberData[3]?.level.toFixed() == 0 ? 1 : rankMemberData[3]?.level.toFixed())}` : ''}\n${rankMemberData[4]?.member.user.tag ? `5️⃣ ${rankMemberData[4]?.member.user.tag}` : ''} ${(rankMemberData[4]?.level.toFixed() == 0 ? 1 : rankMemberData[4]?.level.toFixed()) ? `• Level: ${inlineCode(rankMemberData[4]?.level.toFixed() == 0 ? 1 : rankMemberData[4]?.level.toFixed())}` : ''}\n${rankMemberData[5]?.member.user.tag ? `6️⃣ ${rankMemberData[5]?.member.user.tag}` : ''} ${(rankMemberData[5]?.level.toFixed() == 0 ? 1 : rankMemberData[5]?.level.toFixed()) ? `• Level: ${inlineCode(rankMemberData[5]?.level.toFixed() == 0 ? 1 : rankMemberData[5]?.level.toFixed())}` : ''}\n${rankMemberData[6]?.member.user.tag ? `7️⃣ ${rankMemberData[6]?.member.user.tag}` : ''} ${(rankMemberData[6]?.level.toFixed() == 0 ? 1 : rankMemberData[6]?.level.toFixed()) ? `• Level: ${inlineCode(rankMemberData[6]?.level.toFixed() == 0 ? 1 : rankMemberData[6]?.level.toFixed())}` : ''}\n${rankMemberData[7]?.member.user.tag ? `8️⃣ ${rankMemberData[7]?.member.user.tag}` : ''} ${(rankMemberData[7]?.level.toFixed() == 0 ? 1 : rankMemberData[7]?.level.toFixed()) ? `• Level: ${inlineCode(rankMemberData[7]?.level.toFixed() == 0 ? 1 : rankMemberData[7]?.level.toFixed())}` : ''}\n${rankMemberData[8]?.member.user.tag ? `9️⃣ ${rankMemberData[8]?.member.user.tag}` : ''} ${(rankMemberData[8]?.level.toFixed() == 0 ? 1 : rankMemberData[8]?.level.toFixed()) ? `• Level: ${inlineCode(rankMemberData[8]?.level.toFixed() == 0 ? 1 : rankMemberData[8]?.level.toFixed())}` : ''}\n${rankMemberData[9]?.member.user.tag ? `🔟 ${rankMemberData[9]?.member.user.tag}` : ''} ${(rankMemberData[9]?.level.toFixed() == 0 ? 1 : rankMemberData[9]?.level.toFixed()) ? `• Level: ${inlineCode(rankMemberData[9]?.level.toFixed() == 0 ? 1 : rankMemberData[9]?.level.toFixed())}` : ''}`;
			const embed = new MessageEmbed()
				.setAuthor({ name: `${message.guild.name}'s top ${message.guild.memberCount >= 10 ? 10 : rankMemberData.length} Leaderboard`, iconURL: message.guild.iconURL({ dynamic: true }) })
				.setDescription(leaderboard)
				.setFooter({ text: `${client.user.username} Leveling`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
				.setColor(message.guild?.me.displayHexColor ?? color.discord);
			message.reply({ embeds: [ embed ] });
		});
	},
	async executeSlash(interaction) {
		const { client } = interaction;
		let rankMemberData = [];
		interaction.guild.members.fetch().then(async members => {
			members.array().map(async m => {
				if (m.user.bot) return;
				const level = await db.fetch(`level_${m.guild.id}_${m.user.id}`) ?? 1;
				let totalMessages = db.fetch(`messagesneeded_${m.guild.id}_${m.user.id}`) ?? 0;
				const messagesNeeded = 50 + 50 * (level - 1) + Math.floor((level - 1) / 3) * 25;
				totalMessages = Math.abs(messagesNeeded - totalMessages);
				rankMemberData.push({
					member: m,
					level: isNaN(Number(`${level}.${percentage(messagesNeeded, totalMessages)}`)) ? 0 : Number(`${level}.${percentage(messagesNeeded, totalMessages)}`),
				});
				rankMemberData = rankMemberData.slice(0, interaction.guild.memberCount >= 10 ? 10 : rankMemberData.length);
				return rankMemberData.sort((a, b) => b.level - a.level);
			});
		}).then(async () => {
			rankMemberData = rankMemberData.slice(0, interaction.guild.memberCount >= 10 ? 10 : rankMemberData.length);
			rankMemberData.sort((a, b) => b.level - a.level);
			const leaderboard = `${rankMemberData[0]?.member.user.tag ? `🥇 ${bold(rankMemberData[0]?.member.user.tag)}` : ''} ${(rankMemberData[0]?.level.toFixed() == 0 ? 1 : rankMemberData[0]?.level.toFixed()) ? `• Level: ${inlineCode(rankMemberData[0]?.level.toFixed() == 0 ? 1 : rankMemberData[0]?.level.toFixed())}` : ''}\n${rankMemberData[1]?.member.user.tag ? `🥈 ${bold(rankMemberData[1]?.member.user.tag)}` : ''} ${(rankMemberData[1]?.level.toFixed() == 0 ? 1 : rankMemberData[1]?.level.toFixed()) ? `• Level: ${inlineCode(rankMemberData[1]?.level.toFixed() == 0 ? 1 : rankMemberData[1]?.level.toFixed())}` : ''}\n${rankMemberData[2]?.member.user.tag ? `🥉 ${bold(rankMemberData[2]?.member.user.tag)}` : ''} ${(rankMemberData[2]?.level.toFixed() == 0 ? 1 : rankMemberData[2]?.level.toFixed()) ? `• Level: ${inlineCode(rankMemberData[2]?.level.toFixed() == 0 ? 1 : rankMemberData[2]?.level.toFixed())}` : ''}\n${rankMemberData[3]?.member.user.tag ? `4️⃣ ${rankMemberData[3]?.member.user.tag}` : ''} ${(rankMemberData[3]?.level.toFixed() == 0 ? 1 : rankMemberData[3]?.level.toFixed()) ? `• Level: ${inlineCode(rankMemberData[3]?.level.toFixed() == 0 ? 1 : rankMemberData[3]?.level.toFixed())}` : ''}\n${rankMemberData[4]?.member.user.tag ? `5️⃣ ${rankMemberData[4]?.member.user.tag}` : ''} ${(rankMemberData[4]?.level.toFixed() == 0 ? 1 : rankMemberData[4]?.level.toFixed()) ? `• Level: ${inlineCode(rankMemberData[4]?.level.toFixed() == 0 ? 1 : rankMemberData[4]?.level.toFixed())}` : ''}\n${rankMemberData[5]?.member.user.tag ? `6️⃣ ${rankMemberData[5]?.member.user.tag}` : ''} ${(rankMemberData[5]?.level.toFixed() == 0 ? 1 : rankMemberData[5]?.level.toFixed()) ? `• Level: ${inlineCode(rankMemberData[5]?.level.toFixed() == 0 ? 1 : rankMemberData[5]?.level.toFixed())}` : ''}\n${rankMemberData[6]?.member.user.tag ? `7️⃣ ${rankMemberData[6]?.member.user.tag}` : ''} ${(rankMemberData[6]?.level.toFixed() == 0 ? 1 : rankMemberData[6]?.level.toFixed()) ? `• Level: ${inlineCode(rankMemberData[6]?.level.toFixed() == 0 ? 1 : rankMemberData[6]?.level.toFixed())}` : ''}\n${rankMemberData[7]?.member.user.tag ? `8️⃣ ${rankMemberData[7]?.member.user.tag}` : ''} ${(rankMemberData[7]?.level.toFixed() == 0 ? 1 : rankMemberData[7]?.level.toFixed()) ? `• Level: ${inlineCode(rankMemberData[7]?.level.toFixed() == 0 ? 1 : rankMemberData[7]?.level.toFixed())}` : ''}\n${rankMemberData[8]?.member.user.tag ? `9️⃣ ${rankMemberData[8]?.member.user.tag}` : ''} ${(rankMemberData[8]?.level.toFixed() == 0 ? 1 : rankMemberData[8]?.level.toFixed()) ? `• Level: ${inlineCode(rankMemberData[8]?.level.toFixed() == 0 ? 1 : rankMemberData[8]?.level.toFixed())}` : ''}\n${rankMemberData[9]?.member.user.tag ? `🔟 ${rankMemberData[9]?.member.user.tag}` : ''} ${(rankMemberData[9]?.level.toFixed() == 0 ? 1 : rankMemberData[9]?.level.toFixed()) ? `• Level: ${inlineCode(rankMemberData[9]?.level.toFixed() == 0 ? 1 : rankMemberData[9]?.level.toFixed())}` : ''}`;
			const embed = new MessageEmbed()
				.setAuthor({ name: `${interaction.guild.name}'s top ${interaction.guild.memberCount >= 10 ? 10 : rankMemberData.length} Leaderboard`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
				.setDescription(leaderboard)
				.setFooter({ text: `${client.user.username} Leveling`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
				.setColor(interaction.guild?.me.displayHexColor ?? color.discord);
			interaction.reply({ embeds: [ embed ] });
		});
	},
};

function percentage(oldNumber, newNumber) {
	const decreaseValue = oldNumber - newNumber;
	return ((decreaseValue / oldNumber) * 100).toFixed();
}