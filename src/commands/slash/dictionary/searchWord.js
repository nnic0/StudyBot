const { SlashCommandBuilder } = require('discord.js');
const { RAE } = require('rae-api');
const rae = new RAE();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('def')
    .setDescription('Busca la definición de una palabra')
    .addStringOption(option =>
      option.setName('palabra')
        .setDescription('Escribe la palabra')
        .setRequired(true)
    ),
  async execute(interaction) {
    const word = interaction.options.getString('palabra');

    try {
      const search = await rae.searchWord(word);
      const firstResult = search.results[0];

      if (!firstResult) {
        return interaction.reply('No se encontraron definiciones para esa palabra.');
      }

      const wordId = firstResult.id;
      const result = await rae.fetchWord(wordId);
      const definitions = result.definitions;

      const response = [];
      definitions.forEach((definition, index) => {
        response.push(`**Definición ${index + 1}:** ${definition.content}`);
      });

      interaction.reply({ content: response.join('\n'), ephemeral: true });
    } catch (error) {
      console.error('Error al buscar la definición:', error);
      interaction.reply('Hubo un error al buscar la definición.');
    }
  },
};
