module.exports = {
	name: 'cat',
	description: 'Sends a picture of a cat 🐱',
	cooldown: 3,
	category: 'fun',
	execute(message, args) {
		const fetch = require('node-fetch');
		const sendError = require('../../error.js');
		const color = require('../../color.json');
		const { MessageEmbed } = require('discord.js');
		const { bold } = require('@discordjs/builders');
		fetch('https://cataas.com/cat?json=true')
			.then((res) => res.json())
			.then((res) => {
				const embed = new MessageEmbed()
					.setColor(color.random)
					.setTitle('Cat 🐱')
					.setImage(`https://cataas.com${res.url}`)
					.addFields(
						{
							name: 'Tags',
							value: `${
								res?.tags
									? res.tags.join(` ${bold('|')} `)
									: 'No tags for this cat!'
							} `,
						},
						{
							name: 'Created at',
							value: `${new Date(res.created_at).toLocaleString('en-US', {
								timeZone: 'America/los_angeles',
							})}`,
						},
					)
					.setTimestamp()
					.setFooter(
						'Powered by https://cataas.com',
						'https://cdn2.iconfinder.com/data/icons/documents-and-files-v-2/100/doc-03-512.png',
					);
				message.reply({ embeds: [embed] });
			});
	},
};
