const tipslist = [
	'<:tips:800843897248546826> **TIP:** We have over 100 commands! To see them all, run `/help`',
	'<:tips:800843897248546826> **TIP:** <@776848090564657153> is the creater of this bot.',
	'<:tips:800843897248546826> **TIP:** We now have slash commands!',
	'<:tips:800843897248546826> **TIP:** We have a status page to report issues to. Go to this link to see it: https://coolboibot.statuspage.io/',
	'<:tips:800843897248546826> **TIP:** We also have a mention prefix too',
	'<:tips:800843897248546826> **TIP:** Instead of mentioning people or roles you could use the user or role ID instead',
	'<:tips:800843897248546826> **TIP:** More tips comming soon!',
];
module.exports = {
	name: 'tips',
	description: 'Gives a tip of the bot!',
	category: 'general',
	cooldown: 1.5,
	options: {},
	async execute(message) {
		const tip = Math.floor(Math.random() * Math.floor(tipslist.length));

		await message.reply({ content: `${tipslist[tip]}` });
	},
	async executeSlash(interaction) {
		const index = Math.floor(Math.random() * tipslist.length);
		await interaction.reply({
			content: tipslist[index],
		});
	},
};
