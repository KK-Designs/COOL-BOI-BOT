module.exports = {
	name: 'zodiac',
	description: 'Returns your zodiac sign with the date spcified',
	usage: '[mm dd]',
	cooldown: 3,
	category: 'fun',
	execute(message, args) {
		const sendError = require('../../error.js');
		const month = parseInt(args[0]);
		const day = parseInt(args[1]);

		if (!month) {
			return sendError(' please enter a valid number for month.', message.channel);
		}

		if (month < 1 || month > 12) {
			return sendError(' please enter a valid month [1, 12].', message.channel);
		}

		if (!day) {
			return sendError(' please enter a valid number for day.', message.channel);
		}

		if (month === 1) {
			if (day >= 1 && day <= 19) return message.channel.send({ content: ' your zodiac is Capricorn', reply: { messageReference: message.id } });
			if (day >= 20 && day <= 31) return message.channel.send({ content: ' your zodiac is Aquarius', reply: { messageReference: message.id } });
			return sendError(' please enter a valid date.', message.channel);
		}
		else if (month === 2) {
			if (day >= 1 && day <= 18) return message.channel.send({ content: ' your zodiac is Aquarius', reply: { messageReference: message.id } });
			if (day >= 19 && day <= 29) return message.channel.send({ content: ' your zodiac is Pisces', reply: { messageReference: message.id } });
			return sendError(' please enter a valid date.', message.channel);
		}
		else if (month === 3) {
			if (day >= 1 && day <= 20) return message.channel.send({ content: ' your zodiac is Pisces', reply: { messageReference: message.id } });
			if (day >= 21 && day <= 31) return message.channel.send({ content: ' your zodiac is Aries', reply: { messageReference: message.id } });
			return sendError(' please enter a valid date.', message.channel);
		}
		else if (month === 4) {
			if (day >= 1 && day <= 19) return message.channel.send({ content: ' your zodiac is Aries', reply: { messageReference: message.id } });
			if (day >= 20 && day <= 31) return message.channel.send({ content: ' your zodiac is Taurus', reply: { messageReference: message.id } });
			return sendError(' please enter a valid date.', message.channel);
		}
		else if (month === 5) {
			if (day >= 1 && day <= 20) return message.channel.send({ content: ' your zodiac is Taurus', reply: { messageReference: message.id } });
			if (day >= 21 && day <= 31) return message.channel.send({ content: ' your zodiac is Gemini', reply: { messageReference: message.id } });
			return sendError(' please enter a valid date.', message.channel);
		}
		else if (month === 6) {
			if (day >= 1 && day <= 20) return message.channel.send({ content: 'your zodiac is Gemini', reply: { messageReference: message.id } });
			if (day >= 21 && day <= 31) return message.channel.send({ content: 'your zodiac is Cancer', reply: { messageReference: message.id } });
			return sendError(' please enter a valid date.', message.channel);
		}
		else if (month === 7) {
			if (day >= 1 && day <= 22) return message.channel.send({ content: ' your zodiac is Cancer', reply: { messageReference: message.id } });
			if (day >= 23 && day <= 31) return message.channel.send({ content: ' your zodiac is Leo', reply: { messageReference: message.id } });
			return sendError(' please enter a valid date.', message.channel);
		}
		else if (month === 8) {
			if (day >= 1 && day <= 22) return message.channel.send({ content: 'your zodiac is Leo', reply: { messageReference: message.id } });
			if (day >= 23 && day <= 31) return message.channel.send({ content: 'your zodiac is Virgo', reply: { messageReference: message.id } });
			return sendError(' please enter a valid date.', message.channel);
		}
		else if (month === 9) {
			if (day >= 1 && day <= 22) return message.channel.send({ content: 'your zodiac is Virgo', reply: { messageReference: message.id } });
			if (day >= 23 && day <= 31) return message.channel.send({ content: ' your zodiac is Libra', reply: { messageReference: message.id } });
			return sendError(' please enter a valid date.', message.channel);
		}
		else if (month === 10) {
			if (day >= 1 && day <= 22) return message.channel.send({ content: 'your zodiac is Libra', reply: { messageReference: message.id } });
			if (day >= 23 && day <= 31) return message.channel.send({ content: ' your zodiac is Scorpio', reply: { messageReference: message.id } });
			return sendError(' please enter a valid date.', message.channel);
		}
		else if (month === 11) {
			if (day >= 1 && day <= 21) return message.channel.send({ content: ' your zodiac is Scorpio', reply: { messageReference: message.id } });
			if (day >= 22 && day <= 31) return message.channel.send({ content: ' your zodiac is Sagittarius', reply: { messageReference: message.id } });
			return sendError(' please enter a valid date.', message.channel);
		}
		else if (month === 12) {
			if (day >= 1 && day <= 21) return message.channel.send({ content: ' your zodiac is Sagittarius', reply: { messageReference: message.id } });
			if (day >= 22 && day <= 31) return message.channel.send({ content: ' your zodiac is Capricorn', reply: { messageReference: message.id } });
			return sendError(' please enter a valid date.', message.channel);
		}
		else {
			return sendError(' please enter a valid date.', message.channel);
		}
	},
};