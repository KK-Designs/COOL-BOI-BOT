const chancify = require('chancify');
module.exports = {
	name: 'simprate',
	description: 'Gets your or someone elses simprate!',
	usage: '(@user)',
	cooldown: 1.5,
	category: 'fun',
	options: {
		user: {
			type: 'User',
			description: 'The user to check the simp rate of',
		},
	},
	async execute(message, args, client) {
		const user = message.mentions.users.first() ?? message.client.users.cache.get(args[0]) ?? message.author;

		if (user.id === '644054016476577812') {
			return await message.reply({ content: '<@644054016476577812>\'s simprate is 100%' });
		}
		if (user.id === client.user.id) {
			return await message.reply({ content: 'I no simp' });
		}
		if (user.id === '776848090564657153') {
			return await message.reply({ content: 'My owner is not a simp, I promise' });
		}
		let simprate = Math.floor(Math.random() * 100);
		const chance = () => {
			simprate = 100;
			console.log('Rare occurance: Set simprate to 100%');
		};
		const secretChance = chancify(chance, 1 / 10);
		secretChance();
		await message.reply({ content: `${user}'s simprate is ${simprate}%` });
	},
	async executeSlash(interaction, client) {
		const user = interaction.options.getUser('user');
		let simprate = Math.floor(Math.random() * 101);
		const chance = () => {
			simprate = 100;
			console.log('Rare occurance: Set simprate to 100%');
		};
		const secretChance = chancify(chance, 1 / 10);
		secretChance();
		if (user.id === '644054016476577812') {simprate = 100;}

		if (user.id === client.user.id) {
			return await interaction.reply({ content: 'I no simp' });
		}
		if (user.id === '776848090564657153') {
			return await interaction.reply({ content: 'My owner is not a simp, I promise' });
		}
		const wait = require('util').promisify(setTimeout);
		await interaction.deferReply();
		await wait(750);
		await interaction.editReply({
			content: `${user}'s simprate is ${simprate}%`,
		});
	},
};
