const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Pong'),
  async execute(interaction) {
    const user = interaction.user;

    await interaction.reply(`${user.globalName} pong`);
  },
};
