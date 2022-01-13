const fetch = require('node-fetch');
const color = require('../../color.json');
const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'bored',
	description: 'Gives you something to do! 🤷',
	cooldown: 3,
	category: 'fun',
	options: {},
	async execute(message) {
		fetch('http://www.boredapi.com/api/activity/').then(async (res) => {
			res.json().then(async (activity) => {
				const user = message.author;
				const embed = new MessageEmbed()
					.setColor(color.bot_theme)
					.setTitle('Thing to do')
					.setURL(activity.link)
					.setDescription(activity.activity)
					.addField('**Type: **', activity.type, true)
					.addField('**Participants: **', activity.participants.toString(), true)
					.addField('**Accessibility: **', activity.accessibility.toString(), true)
					.setFooter({ text: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
					.setTimestamp();

				await message.reply({ embeds: [embed] });
			});
		});
	},
	async executeSlash(interaction) {
		fetch('http://www.boredapi.com/api/activity/').then(async (res) => {
			res.json().then(async (activity) => {
				const user = interaction.user;
				const embed = new MessageEmbed()
					.setColor(color.bot_theme)
					.setTitle('Thing to do')
					.setURL(activity.link)
					.setDescription(activity.activity)
					.addField('**Type: **', activity.type, true)
					.addField('**Participants: **', activity.participants.toString(), true)
					.addField('**Accessibility: **', activity.accessibility.toString(), true)
					.setFooter({ text: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
					.setTimestamp();

				await interaction.reply({ embeds: [embed] });
			});
		});
	},
};
