module.exports = {
	name: 'kill',
	description:
		'Kills the mentioned user <a:Enchanted_Diamond_Sword:802774727093256192>',
	cooldown: 1.5,
	category: 'fun',
	execute(message, args) {
		const user =
			message.channel.type === 'dm'
				? message.mentions.users.first() || message.author
				: message.mentions.users.first() ||
				  message.guild.members.cache.get(args[0]) ||
				  message.author;

		const killnotes = [
			'died',
			`was shot by ${message.author}`,
			'fell while trying run to plug in his charger',
			'died from typing too fast',
			`used an uno reverse card and ${message.author} died lmao u suck`,
			'burned to death',
			'drowned in the 2 feet pool',
			'was stabbed with a enchanted diamond sword with `Sharpness V` <a:Enchanted_Diamond_Sword:802774727093256192>',
			'was posioned',
			'died from playing fortnite',
			`was posioned, but he had a bucket of milk and ${user} murdered ${message.author}`,
		];
		const index = Math.floor(Math.random() * Math.floor(killnotes.length));
		message.channel.send({ content: `${user} ${killnotes[index]}` });
	},
};
