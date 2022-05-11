const db = require('quick.db');
const { Collection, MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const Detector = require('discord-crasher-detector');
const DiscordStopSpam = require('discord-stop-spam-package');
const { weirdToNormalChars } = require('weird-to-normal-chars');
const isURI = require('@stdlib/assert-is-uri');
const prefix = require('discord-prefix');
const { detect } = require('tinyld');
const sendError = require('../error');
const config = require('../config.json');
const color = require('../color.json');
/** @type {Collection<string, Collection<string, number>>} */
const cooldowns = new Collection();
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** @type {(...args: import("discord.js").ClientEvents["messageCreate"]) => Promise<any>} */
module.exports = async (message) => {
	const { client } = message;
	const { commands } = client;
	message.content = weirdToNormalChars(message.content);
	DiscordStopSpam.logAuthor(message.author.id);
	DiscordStopSpam.logMessage(message.author.id, message.content);
	const SpamDetected = DiscordStopSpam.checkMessageInterval(message);

	if (SpamDetected) return console.log('Spam detected; ignoring messages');
	if (await runDetector(message).crasher) {
		const m = await runDetector(message).crasherMessage;
		m.reply({ embeds: [{
			color: color.fail,
			description: '<:X_:807305490160943104> Please don\'t send videos that crashes the discord client.',
		}] }).them(async () => {
			setTimeout(async function() {
				return await m.delete();
			}, 10000);
		});
	}
	if (message.author.bot) return;

	if (message.channel.type === 'GUILD_TEXT') {
		await handleLevels(message);
		setGuildDefaults(message.guild);
	}
	// db.delete(`blockedusers_${client.user.id}`, '776848090564657153')
	const guildPrefix = prefix.getPrefix(message.guild?.id ?? message.author.id) ?? config.defaultPrefix;
	const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(guildPrefix)})\\s*`);

	if (!prefixRegex.test(message.content)) return;

	const [, matchedPrefix] = message.content.match(prefixRegex);

	if (!message.content.startsWith(matchedPrefix)) return;

	const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
	let commandName = args.shift().toLowerCase();

	if (detect(commandName) && detect(commandName) !== 'en') {
		console.log(`Command is not in English! translating to ${detect(commandName)}`);
		let res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${detect(commandName)}&tl=en&dt=t&q=${commandName}`);
		res = await res.json();
		res = res && res[0] && res[0][0] && res[0].map(s => s[0]).join('');
		if (!res.ok) console.log('Translation not found');
		commandName = res;
	}

	console.log('Looking for command %s', commandName);
	const command = commands.get(commandName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) {return console.log('Command not found:', commandName);}

	if (userIsBlocked(message.author)) {return void await message.reply({ content: '<:no:803069123918823454> You are blocked from using commands' });}

	const timeLeft = getTimeLeftInCooldown(message.author, command);

	if (timeLeft) {
		const embed = new MessageEmbed()
			.setTitle('Slow down there')
			.setDescription(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`)
			.setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
			.setTimestamp()
			.setColor(message.member?.displayHexColor ?? '#FFB700');
		return void await message.channel.send({ embeds: [embed] });
	}
	if (message.guild) {
		if (cmdIsBlocked(message.guild, command.name)) {return void await message.reply({ content: '<:no:803069123918823454> That is a blacklisted command!' });}

		if (!checkPermissions(message.member, message.channel, command.permissions)) {return void await message.reply({ content: '<:no:803069123918823454> You do not have permission to use this command.' });}

		if (!checkPermissions(message.member, message.channel, command.clientPermissions)) {return void await message.reply({ content: '<:no:803069123918823454> looks like **I** don\'t have permission do run that command. Ask a server mod for help and try again later.' });}
	} else if (command.guildOnly) {
		return void await message.reply({ content: 'That is a server only command. I can\'t execute those inside DMs. Use `/help [command name]` to if it is server only command.' });
	}
	addUserToCooldown(message.author, command);
	console.log('Running command...');
	try {
		command.execute(message, args, client);
		console.log(`Executed command: ${command.name}`);
	} catch (e) {
		console.error(e);
		sendError(`An error has occurred: ${e.message}`, message.channel);
	}
	// the user can type the command ... your command code goes here :)

	// Adds the user to the set so that they can't talk for a minute
	// timestamps.set(message.author.id, now);
	// setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

};
/** @param {import("discord.js").Message} message */
async function handleLevels(message) {
	DiscordStopSpam.logAuthor(message.author.id);
	DiscordStopSpam.logMessage(message.author.id, message.content);
	const SpamDetected = DiscordStopSpam.checkMessageInterval(message);
	if (SpamDetected) return console.log('Spam detected');
	if (message.author.bot) return;
	const { client } = message;
	const { commands } = client;
	const guildPrefix = prefix.getPrefix(message.guild?.id ?? message.author.id) ?? config.defaultPrefix;
	const args = message.content.slice(guildPrefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = commands.get(commandName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (command) {
		await db.add(`commands_${message.guild.id}_${message.author.id}`, 1);
	}
	let res = await fetch(`https://top.gg/api/bots/${message.client.user.id}/check?userId=${message.author.id}`);
	res = await res.json();
	// Check if the user voted
	if (res.voted > 0 && !res?.error) {
		await db.add(`messages_${message.guild.id}_${message.author.id}`, 3);
		await db.add(`messagesneeded_${message.guild.id}_${message.author.id}`, 3);
	} else {
		await db.add(`messages_${message.guild.id}_${message.author.id}`, 1);
		await db.add(`messagesneeded_${message.guild.id}_${message.author.id}`, 1);
	}
	const messagefetch = db.fetch(`messages_${message.guild.id}_${message.author.id}`);
	const levelfetch = db.fetch(`level_${message.guild.id}_${message.author.id}`);
	if (levelfetch == 0 || levelfetch == null) {
		await db.set(`level_${message.guild.id}_${message.author.id}`, 0);
		await db.add(`level_${message.guild.id}_${message.author.id}`, 1);
	}
	let messages;
	if (messagefetch === 50 + 50 * (levelfetch - 1) + Math.floor((levelfetch - 1) / 3) * 25) {messages = messagefetch;}

	if (!isNaN(messages)) {
		await db.add(`level_${message.guild.id}_${message.author.id}`, 1);
		await db.set(`messagesneeded_${message.guild.id}_${message.author.id}`, 0);
		const levelembed = new MessageEmbed()
			.setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
			.setDescription(`${message.author}, You have leveled up to level ${levelfetch}! <:LevelUp:899397460991033374>`)
			.setImage('https://i.imgur.com/USBv4U1.gif?noredirect=true')
			.setTimestamp()
			.setColor(message.member?.displayHexColor ?? '#FFB700');
		if (db.get('blockcmds_' + message.guild.id) === 'level') {
			// ...
		} else {
			await message.channel.send({ embeds: [levelembed] });
		}
	}
}
function listCommandCooldowns(command) {
	let cooldown = cooldowns.get(command.name);
	if (!cooldown) {
		cooldowns.set(command.name, cooldown = new Collection());
	}

	return cooldown;
}
function getCommandCooldown(command) {
	return (command.cooldown ?? 3) * 1000;
}
/**
 * @param {import("discord.js").User} user
 * @param {Object} command
 */
function getTimeLeftInCooldown(user, command) {
	const now = Date.now();
	const timestamps = listCommandCooldowns(command);
	const cooldownAmount = getCommandCooldown(command);
	const expirationTime = timestamps.get(user.id) + cooldownAmount;

	if (expirationTime < now) {return 0;}

	return (expirationTime - now) / 1000;
}
/**
 * @param {import("discord.js").User} user
 * @param {Object} command
 */
function addUserToCooldown(user, command) {
	const timestamps = listCommandCooldowns(command);

	timestamps.set(user.id, Date.now());
}
/**
 * @param {import("discord.js").User} user
 */
function userIsBlocked(user) {
	return db.get('blockedusers_' + user.id) === true;
}
/**
   * @param {import("discord.js").Guild} guild
   */
function setGuildDefaults(guild) {
	if (!db.has('loggingchannel_' + guild.id)) {
		db.set(`loggingchannel_${guild.id}`, '0');
	}
	if (!db.has('welcomechannel_' + guild.id)) {
		db.set(`welcomechannel_${guild.id}`, '0');
	}

}
function cmdIsBlocked(guild, command) {
	const blockedCmd = db.get('blockcmds_' + guild.id);

	return blockedCmd && blockedCmd !== '0' && blockedCmd === command.name;
}
function checkPermissions(member, channel, cmdPerms) {
	if (!cmdPerms) return true;

	return member.permissionsIn(channel).has(cmdPerms);
}
async function runDetector(message, videoUrl = message.content) {
	if (!isURI(videoUrl)) return;

	console.log('Analyzing file %s', videoUrl);
	const analysis = await Detector.AnalyzeVideo(videoUrl).catch(e => {
		if (e !== 'Invalid FileType. File must be a video file') {console.error(e);}

		return {
			crasher: false,
		};
	});

	console.log('Analysis: %s', analysis.crasher);

	return {
		crasher: analysis.crasher ?? false,
		crasherMessage: message,
	};
}