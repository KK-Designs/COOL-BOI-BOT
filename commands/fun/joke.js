module.exports = {
	name: 'joke',
	description: 'Gives a funny joke 😆',
    aliases: ['pun'],
    usage: '(joke id)',
  	cooldown: 3,
  	category: 'fun',
	execute(message, args) {
		require('dotenv').config();
        const { MessageEmbed } = require('discord.js');
        const { spoiler, quote, blockQuote } = require('@discordjs/builders');
        const color = require('../../color.json');
        const id = parseInt(args[0]);
        const { Client } = require("blague.xyz");
        const joker = new Client(process.env.JOKE_API, {
            defaultLang: "en"
        });
        if (!args[0]) {
            joker.randomJoke().then((joke) => {
                const embed = new MessageEmbed()
                .setTitle(`😆 ${joke.question}`)
                .setAuthor(`${message.author.username}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                .setColor(color.bot_theme)
                .setDescription(`${spoiler(joke.answer)}`)            
                .setFooter(`ID: ${joke.id} | The COOL BOI BOT`)
                .setTimestamp();
               return message.reply({ embeds: [ embed ]});
            });
        } else {
        if (isNaN(id)) {
            return message.channel.send({ embeds: [
                new MessageEmbed()
                    .setColor('RED')
                    .setDescription('<:X_:807305490160943104> That doesn\'t seem to be a valid number.'),
            ], reply: { messageReference: message.id } });
        } else if (id < 0 || id > 100) {
            return message.channel.send({ embeds: [
                new MessageEmbed()
                    .setColor('RED')
                    .setDescription('<:X_:807305490160943104> You need to input a number between 0 and 100.'),
            ], reply: { messageReference: message.id } });
        }                
        joker.getJoke(id, "en").then((joke) => {
            const embed = new MessageEmbed()
                .setTitle(`😆 ${joke.question}`)
                .setAuthor(`${message.author.username}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                .setColor(color.bot_theme)
                .setDescription(`${spoiler(joke.answer)}`)            
                .setFooter(`ID: ${id} | The COOL BOI BOT`)
                .setTimestamp();
            message.reply({ embeds: [ embed ]});
        });
        }
	},
};