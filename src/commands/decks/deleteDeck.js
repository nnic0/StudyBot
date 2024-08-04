const { SlashCommandBuilder } = require('@discordjs/builders');
const { deleteDeck } = require("../../services/deckService");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete-deck')
        .setDescription('Elimina un mazo.')
        .addStringOption(option => 
            option.setName('mazo-id')
                .setDescription('ID del mazo')
                .setRequired(true)),
    async execute(interaction) {
        const id = interaction.options.getString('mazo-id');
        const userId = interaction.user.id;
        const result = await deleteDeck(userId, id);
        
        if (result.success) {
            await interaction.reply({ content: result.message, ephemeral: result.ephemeral });
        } else {
            await interaction.reply({ content: result.message, ephemeral: result.ephemeral });
        }
    }
};
