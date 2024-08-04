const { SlashCommandBuilder } = require('@discordjs/builders');
const { loadCards } = require('../../services/cardService');
const { createEmbed } = require('../../utils/embedHelper');
const colors = require('../../utils/colors');
const db = require('../../db/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('load-cards')
        .setDescription('Carga todas las tarjetas que necesitan ser revisadas de un mazo.')
        .addIntegerOption(option => 
            option.setName('mazo-id')
                .setDescription('ID del mazo')
                .setRequired(true)),
    async execute(interaction) {
        const mazoId = interaction.options.getInteger('mazo-id');        
        try {
            const tarjetas = await loadCards(mazoId);
            const query = 'SELECT topic_name FROM topics WHERE topic_id = ?';
            const [topicRow] = await db.runQuery(query, [mazoId]);
            const topicName = topicRow ? topicRow.topic_name : 'Desconocido';

            if (tarjetas.length === 0) {
                await interaction.reply({ content: 'No hay tarjetas para revisar en este mazo.', ephemeral: true });
                return;
            }
            
            let description = `Todas las tarjetas de **${topicName}:**\n`;
            tarjetas.forEach(tarjeta => {
                description += `**ID:** ${tarjeta.card_id} » **Preg.:** ${tarjeta.question}\n**Rta:** ${tarjeta.answer}\n`;
            });
            
            const embed = createEmbed('📝 Tarjetas', description, colors.YELLOW);
            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error('Error al cargar las tarjetas:', error);
            await interaction.reply({ content: 'Hubo un error al cargar las tarjetas.', ephemeral: true });
        }
    }
};
