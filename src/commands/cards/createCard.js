const { SlashCommandBuilder } = require('@discordjs/builders');
const { createCard } = require('../../services/cardService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-card')
        .setDescription('Crea una tarjeta en un mazo específico.')
        .addIntegerOption(option => 
            option.setName('mazo-id')
                .setDescription('ID del mazo')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('pregunta')
                .setDescription('La pregunta de la tarjeta')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('respuesta')
                .setDescription('La respuesta de la tarjeta')
                .setRequired(true)),
    async execute(interaction) {
        const mazoId = interaction.options.getInteger('mazo-id');
        const pregunta = interaction.options.getString('pregunta');
        const respuesta = interaction.options.getString('respuesta');
        const userId = interaction.user.id;

        try {
            await createCard(mazoId, pregunta, respuesta, userId);
            await interaction.reply({ content: `Tarjeta creada con éxito en el mazo ID ${mazoId}.`, ephemeral: true });
        } catch (error) {
            console.error('Error al crear la tarjeta:', error);
            await interaction.reply({ content: 'Hubo un error al crear la tarjeta.', ephemeral: true });
        }
    }
};
