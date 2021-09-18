const simplydjs = require('simply-djs');
const sendError =require("../../error.js")
const color = require('../../color.json');
module.exports = {
  name: 'calc',
  description: 'Calculate the provided expression ➕',
  usage: '[expression]',
  cooldown: 3,
  category: 'other',
  options: {},
  async execute(message, args, client) {
    await simplydjs.calculator(message, {
      embedColor: color.bot_theme, // default: #075FFF
      credit: false
    });
  },
  async executeSlash(interaction) {
    await interaction.deferReply();
    await simplydjs.calculator(interaction, {
      slash: true,
      embedColor: color.bot_theme, // default: #075FFF
      credit: false
    });
  }
};