const { SlashCommandBuilder } = require('@discordjs/builders');
const { loadCards } = require('../../../services/cardService');
const { createEmbed } = require('../../../utils/embedHelper');
const colors = require('../../../utils/colors');
const db = require('../../../db/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('card-review')
        .setDescription('Carga todas las tarjetas que necesitan ser revisadas de un mazo.')
        .addStringOption(option => 
            option.setName('nombre-mazo')
                .setDescription('Nombre del mazo')
                .setRequired(true)),
    async execute(interaction) {
        const mazoName = interaction.options.getString('nombre-mazo');
        const userId = interaction.user.id;    
        try {
            const query = 'SELECT topic_id FROM topics WHERE topic_name = ? AND user_id = ?'
            const params = [mazoName, userId]
            const [topic] = await db.runQuery(query, params);
            const topic_id = topic ? topic.topic_id : null;
            const tarjetas = await loadCards(topic_id);

            if (tarjetas.length === 0) {
                await interaction.reply({ content: 'No hay tarjetas para revisar en este mazo.', ephemeral: true });
                return;
            }

            let description = `Todas las tarjetas de **${mazoName}:**\n\n`;
            tarjetas.forEach((tarjeta, index) => {
                description += `${index + 1}. **Pregunta:** ${tarjeta.question}\n» **Rta:** ${tarjeta.answer}\n\n`;
            });
            
            const embed = createEmbed('📝 Tarjetas', description, colors.YELLOW);
            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error('Error al cargar las tarjetas:', error);
            await interaction.reply({ content: 'Hubo un error al cargar las tarjetas.', ephemeral: true });
        }
    }
};
