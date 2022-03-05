module.exports = {
	name: 'embed',
	description: 'Gets your custom message embed!',
	cooldown: 3,
	category: 'other',
	clientPermissons: 'EMBED_LINKS',
	options: {},
	async execute(message) {
		const simplydjs = require('simply-djs');
		simplydjs.embedCreate(message);
	},
	async executeSlash(interaction) {
		const simplydjs = require('simply-djs');
		await interaction.deferReply();
		simplydjs.embedCreate(interaction);
	},
};
