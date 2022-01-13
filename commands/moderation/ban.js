const { MessageEmbed } = require('discord.js');
const sendError = require('../../error.js');
module.exports = {
	name: 'ban',
	description:
		'Bans the specified user with spcified reason! <:BAN:752937190786465894>',
	guildOnly: true,
	usage: '[@user] (reason)',
	cooldown: 5,
	category: 'moderation',
	permissions: 'BAN_MEMBERS',
	clientPermissons: ['EMBED_LINKS', 'BAN_MEMBERS'],
	options: {
		user: {
			type: 'User',
			description: 'The user to ban',
		},
		reason: {
			type: 'String',
			description: 'The reason for the ban',
			required: false,
		},
	},
	async execute(message, args) {
		const user = message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(() => null);
		const guild = message.guild;

		if (!user) {return sendError('Please provide a valid user for me to ban <:BAN:752937190786465894>', message.channel);}

		if (user.id === message.client.user.id) {
			return await message.reply({ content: 'You can\'t ban me!' });
		}
		const reason = args.slice(1).join(' ') ?? 'No reason provided';
		const banembeddm = new MessageEmbed()
			.setColor('#ffd45c')
			.setTitle('You were banned <:BAN:752937190786465894>')
			.setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
			.addField('Banned by: ', `${message.author.tag}`, true)
			.addField('Reason: ', `${reason}`, true)
			.addField('Server: ', `**${guild.name}**`, true)
			.setTimestamp()
			.setFooter({ text: 'Banned at:' });
		const member = await message.guild.members.fetch(user).catch(() => null);

		if (!member) {return await message.reply({ content: 'That user isn\'t in this guild!' });}

		if (!member.bannable) {
			return await message.reply(
				'I was unable to ban that user. Check if I have the permision `BAN_MEMBERS`. If not that make sure my role is higher than the member you are tying to ban <:BAN:752937190786465894>.',
			);
		}

		if (!user.bot) {
			user.send({ embeds: [banembeddm] });
		}
		// Now we get the member from the user
		// If the member is in the guild
		/**
     * Ban the member
     * Make sure you run this on a member, not a user!
     * There are big differences between a user and a member
     * Read more about what ban options there are over at
     * https://discord.js.org/#/docs/main/master/class/GuildMember?scrollTo=ban
     */
		await message.guild.members.ban(user.id, { reason: reason });
		const banembed = new MessageEmbed()
			.setColor('#940000')
			.setTitle('Member Banned <:BAN:752937190786465894>')
			.setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
			.addField('User banned: ', `${user.tag}`)
			.addField('Banned by: ', `${message.author}`)
			.addField('Reason: ', `${reason}`)
			.setTimestamp()
			.setFooter({ text: 'Banned at:' });

		// We let the message author know we were able to ban the person
		await message.reply({ embeds: [banembed] });
	},
	/**
   * @param {import("discord.js").CommandInteraction<"cached">} interaction
  */
	async executeSlash(interaction) {
		const user = interaction.options.getUser('user', true);
		const member = interaction.options.getMember('user');
		const reason = interaction.options.getString('reason') ?? 'No reason provided';
		const guild = interaction.guild;

		if (user.id === interaction.client.user.id) {
			return await interaction.reply({ content: 'You can\'t ban me!' });
		}
		if (member) {
			if (!member.bannable) {
				return await interaction.reply({
					content: 'I was unable to ban that user. Check if I have the permision `BAN_MEMBERS`. If not that make sure my role is higher than the member you are tying to ban <:BAN:752937190786465894>.',
				});
			}
			if (!member.user.bot) {
				const banembeddm = new MessageEmbed()
					.setColor('#ffd45c')
					.setTitle('You were banned <:BAN:752937190786465894>')
					.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
					.addField('Banned by: ', `${interaction.user}`, true)
					.addField('Reason: ', `${reason}`, true)
					.addField('Server: ', `**${guild.name}**`, true)
					.setTimestamp()
					.setFooter({ text: 'Banned at:' });

				await member.send({ embeds: [banembeddm] }).catch(() => console.warn(`${member.user.tag} has dms disabled`));
			}
		}
		/**
       * Ban the member
       * Make sure you run this on a member, not a user!
       * There are big differences between a user and a member
       * Read more about what ban options there are over at
       * https://discord.js.org/#/docs/main/master/class/GuildMember?scrollTo=ban
       */
		await guild.bans.create(user, { reason: reason });
		const banembed = new MessageEmbed()
			.setColor('#940000')
			.setTitle('Member Banned <:BAN:752937190786465894>')
			.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
			.addField('User banned: ', `${user.tag}`)
			.addField('Banned by: ', `${interaction.user}`)
			.addField('Reason: ', `${reason}`)
			.setTimestamp()
			.setFooter({ text: 'Banned at:' });

		// We let the message author know we were able to ban the person
		await interaction.reply({ embeds: [banembed] });
	},
};
