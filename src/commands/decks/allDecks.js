const { SlashCommandBuilder } = require('@discordjs/builders');
const { getDecks } = require('../../services/deckService');
const { createEmbed } = require('../../utils/embedHelper');
const colors = require('../../utils/colors');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('show-decks')
        .setDescription('Muestra todos los mazos que tienes.'),
    async execute(interaction) {
        const userId = interaction.user.id;

        try {
            let decks = await getDecks(userId);

            if (decks.length === 0) {
                await interaction.reply({ content: 'No tienes ningún mazo.', ephemeral: true });
                return;
            }

            let description = '';
            decks.forEach(deck => {
                description += `**ID:** ${deck.topic_id} » ${deck.topic_name} 📝 ${deck.card_count}\n`;
            });

            const embed = createEmbed('📚 Mazos de estudio', description, colors.ORANGE);
            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            await interaction.reply({ content: result.message, ephemeral: result.ephemeral });
        }
    }
};
