module.exports = async (oldMember, newMember) => {
	const { getLogChannel } = require('../utils.js');

	const { MessageEmbed } = require('discord.js');
	const color = require('../color.json');
	const db = require('quick.db');
	if (oldMember == newMember) return;

	if (!getLogChannel(oldMember.guild, db)) return;
	if (oldMember.nickname !== newMember.nickname) {
		const embed = new MessageEmbed()
			.setAuthor('👤 Nickname changed')
			.setColor(color.bot_theme)
			.setDescription(`<@${newMember.id}> changed their nickname`)
			.addField('Old nickname:', `${oldMember.nickname !== null ? `${oldMember.nickname}` : oldMember.user.username}`, true)
			.addField('New nickname:', `${newMember.nickname !== null ? `${newMember.nickname}` : oldMember.user.username}`, true)
			.setFooter('COOL BOI BOT MEMBER LOGGING')
			.setTimestamp();


		const webhooks = await getLogChannel(oldMember.guild, db).fetchWebhooks();
		const webhook = webhooks.first();

		await webhook.send({
			username: 'COOL BOI BOT Logging',
			avatarURL: 'https://images-ext-1.discordapp.net/external/IRCkcws2ACaLh7lfNgQgZkwMtAPRQvML2XV1JNugLvM/https/cdn.discordapp.com/avatars/811024409863258172/699aa52d1dd597538fc33ceef502b1e6.png',
			embeds: [embed],
		});
	}

	if (oldMember.roles !== newMember.roles) {
		let output = '';
		let outputNew = '';

		oldMember.roles.cache.forEach(role => {
			output += '\n' + role.name;
		});

		newMember.roles.cache.forEach(role => {
			outputNew += '\n' + role.name;
		});

		if (output == outputNew) return;

		if (!getLogChannel(oldMember.guild, db)) return;

		const embed = new MessageEmbed()
			.setAuthor('👤 Member roles updated')
			.setColor(color.bot_theme)
			.setDescription(`Roles updated for <@${newMember.id}>`)
			.addField('Old roles:', `${output}`, true)
			.addField('New roles:', `឵${outputNew}`, true)
			.setThumbnail(`${oldMember.user.displayAvatarURL({ dynamic: true })}`)
			.setFooter('COOL BOI BOT MEMBER LOGGING')
			.setTimestamp();


		const webhooks = await getLogChannel(oldMember.guild, db).fetchWebhooks();
		const webhook = webhooks.first();

		await webhook.send({
			username: 'COOL BOI BOT Logging',
			avatarURL: 'https://images-ext-1.discordapp.net/external/IRCkcws2ACaLh7lfNgQgZkwMtAPRQvML2XV1JNugLvM/https/cdn.discordapp.com/avatars/811024409863258172/699aa52d1dd597538fc33ceef502b1e6.png',
			embeds: [embed],
		});
	}

	if (oldMember.avatar !== newMember.avatar) {

		if (!getLogChannel(oldMember.guild, db)) return;

		const embed = new MessageEmbed()
			.setAuthor('👤 Member avatar updated')
			.setColor(color.bot_theme)
			.setDescription(`Avatar updated for <@${newMember.id}>`)
			.addField('Old avatar:', `${oldMember.user.displayAvatarURL({ dynamic: true })}`, true)
			.addField('New avatar:', `឵${newMember.user.displayAvatarURL({ dynamic: true })}`, true)
			.setFooter('COOL BOI BOT MEMBER LOGGING')
			.setTimestamp();


		const webhooks = await getLogChannel(oldMember.guild, db).fetchWebhooks();
		const webhook = webhooks.first();

		await webhook.send({
			username: 'COOL BOI BOT Logging',
			avatarURL: 'https://images-ext-1.discordapp.net/external/IRCkcws2ACaLh7lfNgQgZkwMtAPRQvML2XV1JNugLvM/https/cdn.discordapp.com/avatars/811024409863258172/699aa52d1dd597538fc33ceef502b1e6.png',
			embeds: [embed],
		});
	}

};