require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client({
	intents: 32767,
	partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'],
	ws: { properties: { $browser: 'Discord iOS' } },
});
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const prefix = require('discord-prefix');
const DiscordStopSpam = require('discord-stop-spam-package');
const commands = (client.commands = new Discord.Collection());
const cooldowns = new Discord.Collection();
const reqEvent = (event) => require(`./events/${event}`);
const Detector = require('discord-crasher-detector');
const isURI = require('@stdlib/assert-is-uri');
const startup = require('./startup.js');
const color = require('./color.json');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
const { getLogChannel } = require('./utils.js');

updateNotifier({ pkg }).notify();

try {
	startup(client, Discord);

	client.once('ready', (...args) => reqEvent('ready')(client, ...args));

	client.on('interactionCreate', async (interaction) => {
		if (!interaction.isButton()) return;
		/* const command = interaction.data.name.toLowerCase();
        const args = interaction.data.options;

 if (command === 'ping'){
            // here you could do anything. in this sample
            // i reply with an api interaction
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                      flags: 64,
                        content: `🏓 Pong! Ping is ${Math.round(client.ws.ping)}ms`
                    }
                }
            })

        }

         if (command === 'invite'){
            // here you could do anything. in this sample
            // i reply with an api interaction
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                      flags: 64,
                        content: `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=3728080855&scope=bot%20applications.commands`
                    }
                }
            })
         }

          if (command === 'yeet'){
            // here you could do anything. in this sample
            // i reply with an api interaction
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: `https://tenor.com/view/yeet-lion-king-simba-rafiki-throw-gif-16194362`
                    }
                }
            })
         }

          if (command === 'tips'){
            let tipslist = [
            '<:tips:800843897248546826> **TIP:** Our commands are not case sensitive, for exaple `!Duck` or `!dUck` would work',
            '<:tips:800843897248546826> **TIP:** <@776848090564657153> is the creater of this bot',
            '<:tips:800843897248546826> **TIP:** Use `!help` to see all the commands in a dm.',
            '<:tips:800843897248546826> **TIP:** We have a status page go to this link to see it: https://stats.uptimerobot.com/n81XLfGOEv/786433082',
            '<:tips:800843897248546826> **TIP:** We also have a mention prefix too',
            '<:tips:800843897248546826> **TIP:** Instead of mentioning people or roles you could use the user or role ID instead',
            '<:tips:800843897248546826> **TIP:** More tips comming soon!',

          ];
          let tip = (Math.floor(Math.random() * Math.floor(tipslist.length)))
            // here you could do anything. in this sample
            // i reply with an api interaction
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                      flags: 64,
                        content: `${tipslist[tip]}`
                    }
                }
            })
         }

    if (command === 'coinflip') {
      let result;
      		let random = (Math.floor(Math.random() * Math.floor(2)));

        if (random === 0) {
          result = 'I flipped heads!';
        }
        else {
          result = 'I flipped tails!';
        }
            // here you could do anything. in this sample
            // i reply with an api interaction
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                      flags: 64,
                        content: `${result}`
                    }
                }
            })
         }

if (command === 'diceroll') {

const n = Math.floor(Math.random() * 6 + 1);
            // here you could do anything. in this sample
            // i reply with an api interaction
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                      flags: 64,
                        content: `${interaction.member.user.username}, you rolled a **${n}**!`
                    }
                }
            })
         }

if (command === '8ball') {
  let eightball = [
            'It is certain.',
            'It is decidedly so.',
            'Without a doubt.',
            'Yes definitely.',
            'You may rely on it.',
            'As I see it, yes.',
            'Most likely.',
            'Outlook good.',
            'Yes.',
            'Signs point to yes.',
            'Reply hazy try again.',
            'Ask again later.',
            'Better not tell you now.',
            'Cannot predict now.',
            'Concentrate and ask again.',
            'Don\'t count on it.',
            'My reply is no.',
            '||<a:rickroll:805174355797082132>||',
            'My sources say no.',
            'Outlook not so good.',
            'Very doubtful.',
            'No way.',
            'Maybe',
            'The answer is hiding inside you',
            'No.',
            'Depends on the mood of the CS god',
            '||No||',
            '||Yes||',
            'Hang on',
            'It\'s over',
            'It\'s just the beginning',
            'Good Luck',
          ];
          let index = (Math.floor(Math.random() * Math.floor(eightball.length)));
            // here you could do anything. in this sample
            // i reply with an api interaction
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                      flags: 64,
                        content: `${eightball[index]}`
                    }
                }
            })
         }

if (command === 'advice') {
const request = require('node-superfetch');
        request
          .get('http://api.adviceslip.com/advice')
          .end((err, res) => {

                JSON.parse(res.text)
              const advice = JSON.parse(res.text)

            // here you could do anything. in this sample
            // i reply with an api interaction
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                      flags: 64,
                        content: `📜  "${advice.slip.advice}"`
                    }
                }
            })
         })
}

if (command === 'kill') {
let user = `<@${args[0].value}>`;
let member =  {
username: interaction.member.user.username
}

let killnotes = [
            'died',
            `was shot by ${member.username}`,
            'fell while trying run to plug in his charger',
            'died from typing too fast',
            `used an uno reverse card and ${member.username} died lmao u suck`,
            'burned to death',
            'drowned in the 2 feet pool',
            `was stabbed with a enchanted diamond sword with \`Sharpness V\` <a:Enchanted_Diamond_Sword:802774727093256192>`,
            'was posioned',
            'died from playing fortnite',
            `was posioned, but he had a bucket of milk and ${user} murdered ${member.username}`,
    ];
              let index = (Math.floor(Math.random() * Math.floor(killnotes.length)));

            // here you could do anything. in this sample
            // i reply with an api interaction
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                      flags: 64,
                        content: `${user} ${killnotes[index]}`
                    }
                }
            })
         }

if (command === 'simprate') {

let user = `<@${args[0].value}>`;
let member =  {
username: interaction.member.user.username
}
let simprate = Math.floor(Math.random() * 100);
if (args[0].value === "644054016476577812") {
  simprate = "100"
}
            // here you could do anything. in this sample
            // i reply with an api interaction
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                      flags: 64,
                        content: `${user}\'s simprate is ${simprate}%`
                    }
                }
            })
         }
*/
	});

	client.on('debug', function() {
		// console.log(`debug -> ${info}`);
	});

	client.on('disconnect', function(event) {
		console.log(
			`The WebSocket has closed and will no longer attempt to reconnect - ${event}`,
		);
	});

	client.on('warn', function(info) {
		console.log(`warn: ${info}`);
	});

	client.on('messageCreate', async (message) => {
		const SpamDetected = await DiscordStopSpam.checkMessageInterval(message);
		if (SpamDetected) {
			return;
		}

		async function runDetector(videoUrl) {
			if (!isURI(videoUrl)) return;
			const analysis = await Detector.AnalyzeVideo(videoUrl, true).catch(() => {
				return;
			});
			if (analysis && analysis.crasher == true) {
				message.delete();
				message.channel.send({
					content: 'Please don\'t send videos that crashes the discord client.',
					reply: { messageReference: message.id },
				});
			}
		}
		runDetector(message.content);

		// setTimeout(async function(){
		if (
			message.channel.type === 'GUILD_TEXT' &&
			!message.author.bot &&
			!message.guild.id === '110373943822540800'
		) {
			// if (api.hasVoted(message.author.id)) {
			// db.add(`messages_${message.guild.id}_${message.author.id}`, 3)
			// } else {
			await db.add(`messages_${message.guild.id}_${message.author.id}`, 1);
			// }
			const messagefetch = db.fetch(
				`messages_${message.guild.id}_${message.author.id}`,
			);

			const levelfetch = db.fetch(
				`level_${message.guild.id}_${message.author.id}`,
			);
			let messages;

			if (
				messagefetch ==
				25 + 25 * levelfetch + Math.floor(levelfetch / 3) * 25
			) {messages = messagefetch;}

			if (!isNaN(messages)) {
				await db.add(`level_${message.guild.id}_${message.author.id}`, 1);

				const levelembed = new MessageEmbed()
					.setAuthor(
						message.author.username,
						message.author.displayAvatarURL({ dymamic: true }),
					)
					.setDescription(
						`${message.author}, You have leveled up to level ${levelfetch + 1}!`,
					)
					.setTimestamp()
					.setColor(
						message.channel.type === 'GUILD_TEXT'
							? message.guild.me.displayHexColor
							: '#FFB700',
					);
				if (db.get('blockcmds_' + message.guild.id) === 'level') {
					// ...
				}
				else {
					await message.channel.send({ embeds: [levelembed] });
				}
			}
		}

		// db.delete(`blockedusers_${client.user.id}`, '776848090564657153')

		if (db.get('blockedusers_' + client.user.id) == null) {
			db.set(`blockedusers_${client.user.id}`, '0');
		}

		if (message.guild) {
			if (db.get('blockcmds_' + message.guild.id) == null) {
				db.set(`blockedusers_${client.user.id}`, '0');
			}
		}
		const blockedUsers = await db.get('blockedusers_' + client.user.id);

		const guild = message.guild;

		if (!message.guild) {
			prefix.setPrefix('!', message.author.id);
		}

		const args1 = message.content.slice(1).trim().split(/ +/);
		const command1 = client.commands.get('prefix');

		prefixViewCommand(args1, command1);

		function prefixViewCommand(args, command) {
			if (message.content.toLowerCase() === '!prefix') {
				return command.execute(message, args, client);
			}
		}

		const defaultPrefix = '!';
		let guildPrefix = prefix.getPrefix(
			message.channel.type === 'GUILD_TEXT'
				? message.guild.id
				: message.author.id,
		);
		if (!guildPrefix) guildPrefix = defaultPrefix;
		const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const prefixRegex = new RegExp(
			`^(<@!?${client.user.id}>|${escapeRegex(guildPrefix)})\\s*`,
		);
		if (!prefixRegex.test(message.content)) return;

		const [, matchedPrefix] = message.content.match(prefixRegex);
		if (!message.content.startsWith(matchedPrefix) || message.author.bot) {return;}

		const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();

		const command =
			client.commands.get(commandName) ||
			client.commands.find(
				(cmd) => cmd.aliases && cmd.aliases.includes(commandName),
			);

		if (command && blockedUsers.includes(message.author.id)) {
			return message.reply({
				embeds: [
					new MessageEmbed()
						.setColor('RED')
						.setDescription(
							'<:X_:807305490160943104> You are blocked from using commands',
						),
				],
			});
		}

		if (message.guild) {
			if (db.get('loggingchannel_' + message.guild.id) == null) {
				db.set(`loggingchannel_${message.guild.id}`, '0');
			}

			if (message.guild) {
				if (db.get('welcomechannel_' + message.guild.id) == null) {
					db.set(`welcomechannel_${message.guild.id}`, '0');
				}
			}
		}

		if (!command) return;

		if (commands) {
			if (!cooldowns.has(command.name)) {
				cooldowns.set(command.name, new Discord.Collection());
			}

			var now = Date.now();
			var timestamps = cooldowns.get(command.name);
			var cooldownAmount = (command.cooldown || 3) * 1000;

			if (timestamps.has(message.author.id)) {
				const expirationTime =
					timestamps.get(message.author.id) + cooldownAmount;

				if (now < expirationTime) {
					const timeLeft = (expirationTime - now) / 1000;
					const embed = new MessageEmbed()
						.setTitle('Slow down there')
						.setDescription(
							`please wait ${timeLeft.toFixed(
								1,
							)} more second(s) before reusing the \`${command.name}\` command.`,
						)
						.setFooter(
							message.author.username,
							message.author.displayAvatarURL({
								dynamic: true,
							}),
						)
						.setTimestamp()
						.setColor(
							message.channel.type === 'GUILD_TEXT'
								? message.guild.me.displayHexColor
								: '#FFB700',
						);
					return message.channel.send({ embeds: [embed] });
				}
			}
		}

		if (message.guild) {
			if (db.get('blockcmds_' + message.guild.id) === '0') {
			}
			else if (
				db.get('blockcmds_' + message.guild.id) &&
				db.get('blockcmds_' + message.guild.id)[1].includes(commandName) ==
					false &&
				commandName === `${db.get('blockcmds_' + message.guild.id)[0]}`
			) {
				return message.reply({
					embeds: [
						new MessageEmbed()
							.setColor('RED')
							.setDescription(
								'<:X_:807305490160943104> That is a blacklisted command!',
							),
					],
				});
			}
			else if (
				db.get('blockcmds_' + message.guild.id) &&
				db.get('blockcmds_' + message.guild.id)[1].includes(commandName)
			) {
				return message.reply({
					embeds: [
						new MessageEmbed()
							.setColor('RED')
							.setDescription(
								'<:X_:807305490160943104> That is a blacklisted command!',
							),
					],
				});
			}
		}

		if (command.clientPermissons == undefined) {
			command.clientPermissons = 'EMBED_LINKS';
		}

		if (command.permissions && message.channel.type === 'GUILD_TEXT') {
			const authorPerms = message.channel.permissionsFor(message.author);
			if (!authorPerms || !authorPerms.has(command.permissions)) {
				return message.reply({
					embeds: [
						new MessageEmbed()
							.setColor('RED')
							.setDescription(
								'<:X_:807305490160943104> You do not have permission to use this command.',
							),
					],
				});
			}
		}

		if (command.clientPermissons && message.channel.type === 'GUILD_TEXT') {
			const clientPerms = message.channel.permissionsFor(guild.me);
			if (!clientPerms || !clientPerms.has(command.clientPermissons)) {
				return message.reply({
					embeds: [
						new MessageEmbed()
							.setColor('RED')
							.setDescription(
								`<:X_:807305490160943104> looks like **I** don\'t have permission do run that command. Ask a server mod for help and try again later. I need the following permissions: ${command.clientPermissons}`,
							),
					],
				});
			}
		}

		if (command.guildOnly && message.channel.type === 'DM') {
			return message.reply({
				embeds: [
					new MessageEmbed()
						.setColor('RED')
						.setDescription(
							'That is a server only command. I can\'t execute those inside DMs. Use `!help [command name]` to if it is server only command.',
						),
				],
			});
		}

		prefixViewCommand1(args, command);

		function prefixViewCommand1(args, command) {
			if (commandName === 'prefix') {
				command.execute(message, args, client);
				return true;
			}
			else {
				return false;
			}
		}

		if (!prefixViewCommand1()) {
			command.execute(message, args, client);
		}

		// the user can type the command ... your command code goes here :)

		// Adds the user to the set so that they can't talk for a minute
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	});

	client.on('guildCreate', reqEvent('guildCreate'));

	client.on('guildDelete', reqEvent('guildDelete'));

	client.on('guildBanRemove', reqEvent('guildBanRemove'));

	client.on('guildBanAdd', reqEvent('guildBanAdd'));

	client.on('guildMemberUpdate', reqEvent('guildMemberUpdate'));

	client.on('emojiUpdate', reqEvent('emojiUpdate'));

	client.on('channelDelete', reqEvent('channelDelete'));

	client.on('channelCreate', reqEvent('channelCreate'));

	client.on('channelUpdate', reqEvent('channelUpdate'));

	client.on('emojiDelete', reqEvent('emojiDelete'));

	client.on('emojiCreate', reqEvent('emojiCreate'));

	client.on('messageUpdate', reqEvent('messageUpdate'));

	client.on('messageDeleteBulk', reqEvent('messageDeleteBulk'));

	client.on('messageDelete', reqEvent('messageDelete'));

	client.on('guildMemberAdd', reqEvent('guildMemberAdd'));

	client.on('guildMemberRemove', reqEvent('guildMemberRemove'));

	process.on('unhandledRejection', async (error) => {
		const user = await client.users.fetch('776848090564657153');
		user.send({
			embeds: [
				new MessageEmbed()
					.setColor(color.fail)
					.setDescription(
						`<:X_:807305490160943104> Your bad at coding and messed something up here\n\n\`${error}\``,
					),
			],
		});
	});

	client.login(process.env.BOT_TOKEN);
}
catch (err) {
	return console.error(err);
}
