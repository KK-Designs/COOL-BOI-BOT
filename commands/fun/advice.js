require('dotenv').config();
const { setTimeout: delay } = require('timers/promises');
const fetch = require('node-fetch');
module.exports = {
	name: 'advice',
	description: 'Gives a word of advice!',
	cooldown: 1,
	category: 'fun',
	options: {},
	async execute(message) {
		await message.channel.sendTyping();
		const res = await fetch('http://api.adviceslip.com/advice');
		if (res.ok) {
			const advice = await res.json();

			setTimeout(() => {
				message.reply({ content: `📜  "${advice.slip.advice}"` });
			}, 750);
		} else {
			message.reply({ content: `Opps, well this is an error. If this continues dm <@${process.env.OWNER_ID}>. \n \nSpeficic error: ${res.statusText}` });
			console.error(`REST call failed: ${res.statusText}, status code: ${res.status}`);
		}
	},
	async executeSlash(interaction) {
		const res = await fetch('http://api.adviceslip.com/advice');

		if (!res.ok) {return await interaction.reply(`HTTP Error ${res.status}: ${res.statusText}`);}

		const advice = await res.json();

		await interaction.deferReply();
		await delay(750);
		await interaction.editReply({
			content: `📜  "${advice.slip.advice}"`,
		});
	},
};
