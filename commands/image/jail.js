module.exports = {
	name: 'jail',
	description: 'Jail your friends!',
	aliases: ['trap'],
	usage: '(user)',
	cooldown: 3,
	category: 'image',
	clientPermissons: ['EMBED_LINKS', 'ATTACH_FILES'],
	async execute(message, args) {
		const Discord = require('discord.js');
		const DIG = require('discord-image-generation');
		const user = message.mentions.users.first() || message.author;
		const img = await new DIG.Jail().getImage(user.displayAvatarURL({ format: 'png' }));
		const attach = new Discord.MessageAttachment(img, 'jail.png');

		message.channel.send({ files: [attach] });
	},
};