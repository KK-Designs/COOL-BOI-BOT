module.exports = {
  name: 'eval',
  description: 'eval',
  cooldown: 2,
  guildOnly: true,
  category: 'util',
  //clientPermissons: 'EMBED_LINKS',
  //permissions: 'ADMINISTRATOR',
  /**
   *
   * @param {import("discord.js").Message} message
   * @param {*} args
   * @param {*} client
   * @returns
   */
  async execute(message, args, client) {
    console.log("Eval command executed.");
    if (message.author.id !== process.env.OWNER_ID)
      return message.channel.send("You try to use the eval command? Straight to jail.");

    try {
      let evaled = await eval(args.join(" "));
      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);

      await message.channel.send({content: code(evaled.slice(0, 1990), "js")});
    } catch (err) {
      console.log(err);
      await message.channel.send(`\`ERROR\` ${code(err)}`);
    }
  }
};
function code(text, lang = "xl") {
  return "```" + `${lang}\n${text}\n` + "```";
}