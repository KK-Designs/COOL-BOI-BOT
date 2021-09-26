const { MessageEmbed } = require('discord.js');
const sendError = require('../../error.js');
module.exports = {
	name: 'kick',
	description: 'Kicks the specified user with spcified reason!',
	guildOnly: true,
	usage: '[@user] (reason)',
	cooldown: 3,
	category: 'moderation',
	permissions: 'KICK_MEMBERS',
	clientPermissons: ['EMBED_LINKS', 'KICK_MEMBERS'],
	options: {
		user: {
			type: 'User',
			description: 'The user to kick',
		},
		reason: {
			type: 'String',
			description: 'The reason for the ban',
			required: false,
		},
	},
	async execute(message, args) {
		const guild = message.guild;
		const user = message.mentions.users.first() || message.client.users.cache.get(args[0]);

		if (!user) {return sendError('Please provide a valid user for me to kick', message.channel);}

		if (user.id === '811024409863258172') {
			return message.reply({ content: 'You can\'t ban me!' });
		}
		let reason = args.slice(1).join(' ');
		if (reason === '') {
			reason = 'No reason provided';
		}
		if (!user.bot) {
			const kickembeddm = new MessageEmbed()
				.setColor('#ffd45c')
				.setTitle('You were kicked')
				.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
				.addField('Kicked by: ', message.author.tag)
				.addField('Reason: ', `${reason}`)
				.addField('Server: ', `**${guild.name}**`)
				.setTimestamp()
				.setFooter('Kicked at:');

			user.send({ embeds: [kickembeddm] }).catch(console.error);
		}
		// Assuming we mention someone in the message, this will return the user
		// Read more about mentions over at https://discord.js.org/#/docs/main/master/class/MessageMentions
		// Now we get the member from the user
		const member = message.guild.members.fetch(user);

		// If the member is in the guild
		if (member) {
			/**
       * Kick the member
       * Make sure you run this on a member, not a user!
       * There are big differences between a user and a member
       */
			try {
				await member.kick();
			}
			catch (e) {
				console.error(e);

				return await message.reply(
					'I was unable to kick that user. Check if I have the permision `KICK_MEMBERS`. If not that make my my role is higher than the member you are tying to kick.',
				);
			}
			if (reason === '') {
				reason = 'No reason provided';
			}
			const kickembed = new MessageEmbed()
				.setColor('#940000')
				.setTitle('Member Kicked')
				.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
				.addField('User kicked: ', '<@' + message.mentions.users.first().id + '>')
				.addField('Kicked by: ', '<@' + message.author.id + '>')
				.addField('Reason: ', `${reason}`)
				.setTimestamp()
				.setFooter('Kicked at:');

			// We let the message author know we were able to kick the person
			message.channel.send({ embeds: [kickembed] });
		}
		else {
			// The mentioned user isn't in this guild
			return message.reply({ content: 'That user isn\'t in this guild!' });
		}
	},
	async executeSlash(interaction) {
		const guild = interaction.guild;
		const member = interaction.options.getMember('user', true);
		const reason = interaction.options.getString('reason') ?? 'No reason provided';

		if (member.id === '811024409863258172') {
			return interaction.reply({ content: 'You can\'t kick me!' });
		}
		if (!member.user.bot) {
			const kickembeddm = new MessageEmbed()
				.setColor('#ffd45c')
				.setTitle('You were kicked')
				.setAuthor(interaction.author.username, interaction.author.displayAvatarURL({ dynamic: true }))
				.addField('Kicked by: ', '<@' + interaction.author.id.toString() + '>')
				.addField('Reason: ', `${reason.toString()}`)
				.addField('Server: ', `**${guild.name.toString()}**`)
				.setTimestamp()
				.setFooter('Kicked at:');

			await member.send({ embeds: [kickembeddm] }).catch(console.error);
		}
		/**
     * Kick the member
     * Make sure you run this on a member, not a user!
     * There are big differences between a user and a member
     */
		try {
			await member.kick();
		}
		catch (e) {
			console.error(e);

			return await interaction.reply(
				'I was unable to kick that user. Check if I have the permision `KICK_MEMBERS`. If not that make my my role is higher than the member you are tying to kick.',
			);
		}
		const kickembed = new MessageEmbed()
			.setColor('#940000')
			.setTitle('Member Kicked')
			.setAuthor(interaction.author.username, interaction.author.displayAvatarURL({ dynamic: true }))
			.addField('User kicked: ', '<@' + interaction.mentions.users.first().id + '>')
			.addField('Kicked by: ', '<@' + interaction.author.id + '>')
			.addField('Reason: ', `${reason}`)
			.setTimestamp()
			.setFooter('Kicked at:');

		// We let the message author know we were able to kick the person
		await interaction.reply({ embeds: [kickembed] });
	},
};