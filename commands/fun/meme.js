module.exports = {
	name: 'meme',
	description: 'Returns a random meme!  <:XD:772959485898915880>',
	cooldown: 1.5,
	category: 'fun',
	clientPermissons: 'EMBED_LINKS',
	async	execute(message, args) {
		const fetch = require('node-fetch');
		const { MessageEmbed } = require('discord.js');
		const sendError = require('../../error.js');
		 try {
			let res = await fetch('https://meme-api.herokuapp.com/gimme');
			res = await res.json();
			if (res.nsfw == false) {
				var embed = new MessageEmbed()
					.setTitle(res.title)
					.setURL(res.postLink)
					.setImage(res.url)
					.setFooter('By ' + res.author + ` | 👍 ${res.ups}`)
					.setTimestamp()
					.setColor(message.channel.type === 'dm' ? '#41C3DC' : message.guild.me.displayHexColor,
					);
				message.channel.send({ embeds: [ embed ], reply: { messageReference: message.id } });
			}
			else {
				const channel = message.channel;
				if (channel.nsfw) {
					message.channel.send(embed);
				}
				else {
					message.channel.send({ content: 'This current meme is a NSFW meme. To see it, go to a msfw channel', reply: { messageReference: message.id } });
				}
			}
		}
		catch (err) {
			// message.client.logger.error(err.stack);
			sendError(`Oops, well this is an error. If this continues dm <@765686109073440808>. \n \nSpeficic error: ${err}`, message.channel);
			console.log(err);
		}
	},
};