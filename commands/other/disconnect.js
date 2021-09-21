const {getVoiceConnection} = require('@discordjs/voice');
const sendError = require("../../error.js");
module.exports = {
  name: 'disconnect',
  aliases: ['leave'],
  description: 'If the bot is in a voice channel it leaves it.',
  guildOnly: true,
  cooldown: 3,
  category: 'other',
  async execute(message, args) {
    
    const connection = getVoiceConnection(message.guild.id);

    if (!connection) {
      return await sendError('Im not in a voice channel!', message.channel);
    }
    connection.destroy();
    await message.reply({content: `I have disconnected from the voice channel <:voice_channel:804772497684693052>`});
    
  }
};