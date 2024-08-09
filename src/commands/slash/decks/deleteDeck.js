const { SlashCommandBuilder } = require('@discordjs/builders');
const { deleteDeck } = require("../../../services/deckService");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deck-remove')
        .setDescription('Elimina un mazo.')
        .addStringOption(option => 
            option.setName('nombre')
                .setDescription('Nombre del mazo')
                .setRequired(true)),
    async execute(interaction) {
        const name = interaction.options.getString('nombre');
        const userId = interaction.user.id;
        const result = await deleteDeck(userId, name);
        
        if (result.success) {
            await interaction.reply({ content: result.message, ephemeral: result.ephemeral });
        } else {
            await interaction.reply({ content: result.message, ephemeral: result.ephemeral });
        }
    }
};
