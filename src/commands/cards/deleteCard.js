const { SlashCommandBuilder } = require('@discordjs/builders');
const { deleteCard } = require('../../services/cardService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete-card')
        .setDescription('Elimina una tarjeta de un mazo.')
        .addIntegerOption(option => 
            option.setName('tarjeta-id')
                .setDescription('ID de la tarjeta')
                .setRequired(true)),
    async execute(interaction) {
        const tarjetaId = interaction.options.getInteger('tarjeta-id');
        const userId = interaction.user.id;
        ;
        try {
            await deleteCard(userId, tarjetaId);
            await interaction.reply({ content: `Tarjeta ID ${tarjetaId} eliminada con éxito.`, ephemeral: true });
        } catch (error) {
            console.error('Error al eliminar la tarjeta:', error);
            await interaction.reply({ content: 'Hubo un error al eliminar la tarjeta.', ephemeral: true });
        }
    }
};
