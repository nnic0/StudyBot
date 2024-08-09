const { SlashCommandBuilder } = require('@discordjs/builders');
const { renameDeck } = require('../../../services/deckService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deck-rename')
        .setDescription('Renombra un mazo.')
        .addStringOption(option => 
            option.setName('nombre')
                .setDescription('Nombre del mazo')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('nuevo-nombre')
                .setDescription('Nuevo nombre del mazo')
                .setRequired(true)),
    async execute(interaction) {
        const deckName = interaction.options.getString('nombre');
        const newName = interaction.options.getString('nuevo nombre');
        const userId = interaction.user.id;
        
        const result = await renameDeck(userId, deckName, newName);
        
        if (result.success) {
            await interaction.reply({ content: result.message, ephemeral: result.ephemeral });
        } else {
            await interaction.reply({ content: result.message, ephemeral: result.ephemeral });
        }
    }
};
