const fetch = require('node-fetch').default;
const { MessageEmbed } = require('discord.js');
const sendError = require('../../error.js');
module.exports = {
	name: 'meme',
	description: 'Returns a random meme!  <:XD:772959485898915880>',
	cooldown: 1.5,
	category: 'fun',
	clientPermissons: 'EMBED_LINKS',
	options: {},
	async execute(message, args) {

		const res = await fetch('https://meme-api.herokuapp.com/gimme').then(r => r.json());

		if (res.nsfw && !(message.channel.nsfw ?? true)) {return await message.reply({ content: 'This current meme is a NSFW meme. To see it, go to a nsfw channel' });}

		const embed = new MessageEmbed()
			.setTitle(res.title)
			.setURL(res.postLink)
			.setImage(res.url)
			.setFooter('By ' + res.author + ` | 👍 ${res.ups}`)
			.setTimestamp()
			.setColor(message.guild?.me.displayHexColor ?? '#41C3DC');

		await message.reply({ embeds: [embed] });
	},
	async executeSlash(interaction) {
		const url = new URL('/gimme', 'https://meme-api.herokuapp.com');
		const res = await fetch(url);

		if (!res.ok) {return await interaction.reply(`HTTP Error ${res.status}: ${res.statusText}`);}

		const body = await res.json();

		if (body.nsfw && !(interaction.channel.nsfw ?? true)) {return await interaction.reply({ content: 'This current meme is a NSFW meme. To see it, go to a nsfw channel' });}

		const embed = new MessageEmbed()
			.setTitle(body.title)
			.setURL(body.postLink)
			.setImage(res.url)
			.setFooter('By ' + body.author + ` | 👍 ${body.ups}`)
			.setTimestamp()
			.setColor(interaction.guild?.me.displayHexColor ?? '#41C3DC');

		await interaction.reply({ embeds: [embed] });
	},
};