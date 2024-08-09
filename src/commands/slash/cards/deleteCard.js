const { SlashCommandBuilder } = require('@discordjs/builders');
const { deleteCard } = require('../../../services/cardService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('card-remove')
        .setDescription('Elimina una tarjeta de un mazo.')
        .addStringOption(option => 
            option.setName('pregunta')
                .setDescription('Pregunta de la tarjeta')
                .setRequired(true)),
    async execute(interaction) {
        const question = interaction.options.getString('pregunta');
        const userId = interaction.user.id;
        ;
        try {
            await deleteCard(userId, question);
            await interaction.reply({ content: `Tarjeta ID ${question} eliminada con éxito.`, ephemeral: true });
        } catch (error) {
            console.error('Error al eliminar la tarjeta:', error);
            await interaction.reply({ content: 'Hubo un error al eliminar la tarjeta.', ephemeral: true });
        }
    }
};
