require('dotenv').config();
module.exports = {
	name: 'simprate',
	description: 'Gets your or someone elses simprate!',
	usage: '(@user)',
	cooldown: 1.5,
	category: 'fun',
	execute(message, args) {
		const user =
			message.channel.type === 'dm'
				? message.mentions.users.first() || message.author
				: message.mentions.users.first() ||
				  message.guild.members.cache.get(args[0]) ||
				  message.author;
		if (message.mentions.has('644054016476577812')) {
			return message.channel.send({
				content: '<@644054016476577812>\'s simprate is 100%',
			});
		}

		if (message.mentions.has(message.client.user.id)) {
			return message.channel.send({ content: 'I no simp' });
		}

		if (message.mentions.has(process.env.OWNER_ID)) {
			return message.channel.send({
				content: 'My owner is not a simp, I promise',
			});
		}

		const simprate = Math.floor(Math.random() * 100);
		message.channel.send({ content: `${user}'s simprate is ${simprate}%` });
	},
};
