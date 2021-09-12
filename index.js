require("dotenv").config();
const Discord = require('discord.js');
const client = new Discord.Client({
  //intents: 24287,
  intents: [
    "GUILDS",
    "GUILD_MEMBERS",
    "GUILD_MESSAGES",
    "GUILD_BANS",
    "GUILD_EMOJIS_AND_STICKERS",
    "GUILD_VOICE_STATES",
    //"GUILD_PRESENCES",
    "DIRECT_MESSAGES",
    "GUILD_MESSAGE_REACTIONS"
  ],
  partials: [
    'MESSAGE',
    'CHANNEL',
    'REACTION',
    'GUILD_MEMBER',
    'USER'
  ],
  ws: {properties: {$browser: "Discord iOS"}}
});
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');

updateNotifier({pkg}).notify();
client.commands = new Discord.Collection();
const reqEvent = (event) => {
  // eslint-disable-next-line global-require
  const run = require(`./events/${event}`);

  return async (...args) => {
    try {
      await run(...args);
    } catch (e) {
      console.error(e);
    }
  };
};
const startup = require('./startup.js');
const config = require("./config.json");

startup(client);
client.once('ready', reqEvent('ready').bind(null, client));
client.on("debug", (info) => {
  console.log(`debug -> ${info}`);
});
client.on("disconnect", (event) => {
  console.log(`The WebSocket has closed and will no longer attempt to reconnect - ${event}`);
});
client.on("warn", (info) => {
  console.log(`warn: ${info}`);
});
//client.destroy();
try {
  client.on('guildCreate', reqEvent('guildCreate'));
  client.on('guildBanRemove', reqEvent('guildBanRemove'));
  client.on('guildBanAdd', reqEvent('guildBanAdd'));
  client.on('guildMemberUpdate', reqEvent('guildMemberUpdate'));
  client.on('emojiUpdate', reqEvent('emojiUpdate'));
  client.on('channelDelete', reqEvent('channelDelete'));
  client.on('channelCreate', reqEvent('channelCreate'));
  client.on('channelUpdate', reqEvent('channelUpdate'));
  client.on('emojiDelete', reqEvent('emojiDelete'));
  client.on('emojiCreate', reqEvent('emojiCreate'));
  client.on("messageCreate", reqEvent("messageCreate"));
  client.on('messageUpdate', reqEvent('messageUpdate'));
  client.on('messageDeleteBulk', reqEvent('messageDeleteBulk'));
  client.on('messageDelete', reqEvent('messageDelete'));
  client.on('guildMemberAdd', reqEvent('guildMemberAdd'));
  client.on('guildMemberRemove', reqEvent('guildMemberRemove'));
  client.on('interactionCreate', reqEvent('interactionCreate'));

} catch (err) {
  console.error(err);
}
client.login(process.env.BOT_TOKEN);
let processing = false;
process.on("SIGINT", () => {
  if (processing)
    return console.log("Already shutting down");

  console.log("Shutting down...");
  const timer = setTimeout(() => {
    console.log("Took too long. Forcing a shutdown");
    process.exit(1);
  });

  console.log("Destroying queues");
  for (const queue of client.queue.values())
    queue.destroy();

  console.log("Destroying client");
  client.destroy();
  clearTimeout(timer);
  console.log("Success. Closing process");
  process.exit();
});