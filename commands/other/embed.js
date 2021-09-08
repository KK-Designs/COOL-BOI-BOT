module.exports = {
	name: 'embed',
	description: 'Gets your custom message embed!',
	cooldown: 5,
	category: 'other',
	clientPermissons: 'EMBED_LINKS',
	execute(message, args) {
		const color = require('../../color.json');
		const simplydjs = require('simply-djs');
		simplydjs.embedCreate(message);
	},
};