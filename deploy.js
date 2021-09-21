require("dotenv").config();
const assert = require("assert/strict");
const fs = require("fs");
const {
  SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder
} = require("@discordjs/builders");
const {Routes} = require('discord-api-types/v9');
const {REST} = require("@discordjs/rest");
const config = require("./config.json");
const rest = new REST({version: "9"})
  .setToken(process.env.BOT_TOKEN);
const commands = [];

for (const categoryEnt of fs.readdirSync("./commands", {withFileTypes: true})) {
  if (!categoryEnt.isDirectory())
    continue;
  
  for (const fileEnt of fs.readdirSync(`./commands/${categoryEnt.name}`, {withFileTypes: true})) {
    if (!fileEnt.isFile() || fileEnt.name.startsWith(".") || !fileEnt.name.endsWith(".js"))
      continue;

    console.log(`Loading ${categoryEnt.name}/${fileEnt.name}`);
    // eslint-disable-next-line global-require
    const command = require(`./commands/${categoryEnt.name}/${fileEnt.name}`);

    if (!command.executeSlash) {
      console.warn(`Slash commands aren't setup`);
      continue;
    }
    if (!command.options) {
      throw new Error(`Has slashExecute, but no options object`);
    }
    const slashCmd = new SlashCommandBuilder()
      .setName(command.name)
      .setDescription(command.description);

    build(slashCmd, command.options);
    const len = commands.push(slashCmd);

    console.log(len);
  }
}
const main = async () => {
  console.log("Retriving client id...");
  /** @type {import("discord-api-types").APIApplication} */
  // eslint-disable-next-line no-extra-parens
  const app = (await rest.get(Routes.oauth2CurrentApplication()));

  console.log(`Deploying ${commands.length} commands as Application ${app.name} (${app.id}) `);
  console.log(commands.map(c => c.name).sort());
  await rest.put(
  //  Routes.applicationCommands(app.id),
    Routes.applicationGuildCommands(app.id, "800597178602225725"),
    {body: commands}
  );
  console.log("Successfully deployed commands");
};
function build(builder, options) {
  for (let [name, optionData] of Object.entries(options)) {
    switch (optionData.type) {
      // Can't define choices
      case "Boolean":
      case "Channel":
      case "Mentionable":
      case "Role":
      case "User": {
        assert(!(builder instanceof SlashCommandSubcommandGroupBuilder));
        const required = optionData.required ?? true;

        builder[`add${optionData.type}Option`](/** @param {import("@discordjs/builders/dist/interactions/slashCommands/mixins/CommandOptionBase").SlashCommandOptionBase} option */ option => option
          .setName(name)
          .setDescription(optionData.description)
          .setRequired(required));
      } break;
      // Can define choices
      case "Integer":
      case "String":
      case "Number": {
        if (builder instanceof SlashCommandSubcommandGroupBuilder)
          throw new TypeError("Cannot add Non-Group options in Sub-Command Groups");

        const choices = Object.entries(optionData.choices ?? {});

        builder[`add${optionData.type}Option`](/** @param {import("@discordjs/builders/dist/interactions/slashCommands/mixins/CommandOptionWithChoices").ApplicationCommandOptionWithChoicesBase<string|number>} option */ option => {
          // eslint-disable-next-line no-self-assign
          optionData = /** @type {import("./handlers/command").ChoiceOption} */ optionData;

          return option
            .setName(name)
            .setDescription(optionData.description)
            .setRequired(optionData.required ?? true)
            .addChoices(choices);
        });
      } break;
      // Sub commands
      case "Subcommand": {
        if (builder instanceof SlashCommandSubcommandBuilder)
          throw new TypeError("Cannot add Sub-Commands in Sub-Commands");

        const {options: optionOptions} = optionData;

        builder.addSubcommand(option => {
          option
            .setName(name)
            .setDescription(optionData.description);

          return build(option, optionOptions);
        });
      } break;
      case "SubcommandGroup": {
        if (!(builder instanceof SlashCommandBuilder))
          throw new TypeError("Sub-Command groups must be on the top level");

        const {options: optionOptions} = optionData;

        builder.addSubcommandGroup(option => {
          option
            .setName(name)
            .setDescription(optionData.description);

          return build(option, optionOptions);
        });
      } break;
      default:
        throw new Error(`Unrecognized for ${name} option ${optionData.type}`);
    }
  }

  return builder;
}
module.exports = main;
// Automatically calls main function if this file is being called directly with node
if (require.main === module)
  main();