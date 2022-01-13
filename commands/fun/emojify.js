module.exports = {
	name: 'emojify',
	description: 'Emojifies your text!',
	usage: '[message]',
	cooldown: 3,
	category: 'fun',
	clientPermissons: 'EMBED_LINKS',
	execute(message, args) {
		const user = message.author;
		const color = require('../../color.json');
		const sendError = require('../../error.js');
		const { MessageEmbed } = require('discord.js');
		if (!args[0]) {
			return sendError(
				'Please provide text for me to emojify (i.e. `!emojify hello`)',
				message.channel,
			);
		}
		const numberMap = {
			0: ':zero:',
			1: ':one:',
			2: ':two:',
			3: ':three:',
			4: ':four:',
			5: ':five:',
			6: ':six:',
			7: ':seven:',
			8: ':eight:',
			9: ':nine:',
		};
		const numericalMap = {
			'?': ':question:',
			'!': ':exclamation:',
			x: ':x:',
			'!!': ':bangbang:',
			'!?': ':interrobang:',
			$: ':heavy_dollar_sign:',
			'#': ':hash:',
			'*': ':asterisk:',
		};
		let msg = message.content.slice(
			message.content.indexOf(args[0]),
			message.content.length,
		);
		msg = msg
			.split('')
			.map((c) => {
				if (c === ' ') {return c;}
				else if (/[0-9]/.test(c)) {return numberMap[c];}
				else if (/^[?!!!!?$x#*]*$/.test(c)) {return numericalMap[c];}
				else {
					return /[a-zA-Z]/.test(c)
						? ':regional_indicator_' + c.toLowerCase() + ':'
						: '';
				}
			})
			.join('');

		if (msg.length > 2048) {
			msg = msg.slice(0, msg.length - (msg.length - 2033));
			msg = msg.slice(0, msg.lastIndexOf(':')) + '**...**';
		}
		const emojiembed = new MessageEmbed()
			.setTitle('Emojified Text:')
			.setDescription(msg)
			.setFooter(user.username, user.displayAvatarURL({ dynamic: true }))
			.setTimestamp()
			.setColor(
				message.channel.type === 'dm'
					? color.discord
					: message.guild.me.displayHexColor,
			);
		message.reply({
			embeds: [emojiembed],
			reply: { messageReference: message.id },
		});
	},
};
