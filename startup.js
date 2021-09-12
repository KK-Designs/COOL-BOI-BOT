const fs = require('fs');
const {
  Collection
} = require("discord.js");
const start_giveaway = require('./giveaway.js');
module.exports = (client) => {

  client.queue = new Collection();
  const commandFolders = fs.readdirSync('./commands');
  const categories = new Collection();

  for (const categoryName of commandFolders) {
    const categoryCmds = new Collection();
    const commandFiles = fs.readdirSync(`./commands/${categoryName}`).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      console.log("Loading command %s (%s)", file, categoryName);
      const command = require(`./commands/${categoryName}/${file}`);

      client.commands.set(command.name, command);
      categoryCmds.set(command.name, command);
    }
    categories.set(categoryName, categoryCmds);
  }
  client.commands.forEach(command => {
    const category = categories.get(command.category) ?? new Collection();

    if (category) {
      category.set(command.name, command);
    } else {
      categories.set(command.category, new Collection().set(command.name, command));
    }
  });
  start_giveaway(client);
};