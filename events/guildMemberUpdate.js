module.exports = (oldMember, newMember) => {
	const { MessageEmbed } = require('discord.js');
	const color = require('../color.json');
	const db = require('quick.db');
	if (oldMember == newMember) return;

	var modLogChannel = db.get('loggingchannel_' + oldMember.guild.id);
	var modLogChannel = oldMember.guild.channels.cache.get(modLogChannel);

	if (!modLogChannel) return;
	if (oldMember.nickname !== newMember.nickname) {
		const embed = new MessageEmbed()
			.setAuthor('👤 Nickname changed')
			.setColor(color.bot_theme)
			.setDescription(`<@${newMember.id}> changed their nickname`)
			.addField('Old nickname:', `${oldMember.nickname !== null ? `${oldMember.nickname}` : oldMember.user.username}`, true)
			.addField('New nickname:', `${newMember.nickname !== null ? `${newMember.nickname}` : oldMember.user.username}`, true)
			.setFooter('COOL BOI BOT MEMBER LOGGING')
			.setTimestamp();

		modLogChannel.send({ embeds: [embed] }).catch();
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

		var modLogChannel = db.get('loggingchannel_' + oldMember.guild.id);
		var modLogChannel = oldMember.guild.channels.cache.get(modLogChannel);

		if (!modLogChannel) return;

		const embed = new MessageEmbed()
			.setAuthor('👤 Member roles updated')
			.setColor(color.bot_theme)
			.setDescription(`Roles updated for <@${newMember.id}>`)
			.addField('Old roles:', `${output}`, true)
			.addField('New roles:', `឵${outputNew}`, true)
			.setThumbnail(`${oldMember.user.displayAvatarURL({ dynamic: true })}`)
			.setFooter('COOL BOI BOT MEMBER LOGGING')
			.setTimestamp();

		modLogChannel.send({ embeds: [embed] }).catch();
	}

	if (oldMember.avatar !== newMember.avatar) {
		var modLogChannel = db.get('loggingchannel_' + oldMember.guild.id);
		var modLogChannel = oldMember.guild.channels.cache.get(modLogChannel);

		if (!modLogChannel) return;

		const embed = new MessageEmbed()
			.setAuthor('👤 Member avatar updated')
			.setColor(color.bot_theme)
			.setDescription(`Avatar updated for <@${newMember.id}>`)
			.addField('Old avatar:', `${oldMember.user.displayAvatarURL({ dynamic: true })}`, true)
			.addField('New avatar:', `឵${newMember.user.displayAvatarURL({ dynamic: true })}`, true)
			.setFooter('COOL BOI BOT MEMBER LOGGING')
			.setTimestamp();

		modLogChannel.send({ embeds: [embed] }).catch();
	}

};