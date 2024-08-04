const { SlashCommandBuilder } = require('discord.js');
const { RAE } = require('rae-api');
const rae = new RAE();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('anagrama')
    .setDescription('Busca anagramas de una palabra')
    .addStringOption(option =>
      option.setName('palabra')
        .setDescription('Palabra para buscar anagramas')
        .setRequired(true)
    ),
  async execute(interaction) {
    const palabra = interaction.options.getString('palabra');

    try {
      const search = await rae.searchAnagram(palabra);
      const anagrams = search.results;

      if (anagrams.length === 0) {
        return interaction.reply('No se encontraron anagramas para esa palabra.');
      }

      const response = anagrams.map((anagram, index) => `${index + 1}. ${anagram.word}`).join('\n');
      interaction.reply({ content: response, ephemeral: true });
    } catch (error) {
      console.error('Error al buscar anagramas:', error);
      interaction.reply('Hubo un error al buscar los anagramas.');
    }
  },
};
