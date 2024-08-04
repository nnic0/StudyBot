const { SlashCommandBuilder } = require('@discordjs/builders');
const { renameDeck } = require('../../services/deckService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rename-deck')
        .setDescription('Renombra un mazo.')
        .addStringOption(option => 
            option.setName('mazo-id')
                .setDescription('ID del mazo')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('nombre')
                .setDescription('Nuevo nombre')
                .setRequired(true)),
    async execute(interaction) {
        const topicId = interaction.options.getString('mazo-id');
        const newName = interaction.options.getString('nombre');
        const userId = interaction.user.id;
        
        const result = await renameDeck(userId, topicId, newName);
        
        if (result.success) {
            await interaction.reply({ content: result.message, ephemeral: result.ephemeral });
        } else {
            await interaction.reply({ content: result.message, ephemeral: result.ephemeral });
        }
    }
};
