const { SlashCommandBuilder } = require('@discordjs/builders');
const { createUser } = require('../../services/userService');
const { createDeck } = require("../../services/deckService");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-deck')
        .setDescription('Crea un mazo para crear tarjetas en el mismo.')
        .addStringOption(option => 
            option.setName('tema')
                .setDescription('Nombre del mazo')
                .setRequired(true)),
    async execute(interaction) {
        const tema = interaction.options.getString('tema');
        const userId = interaction.user.id;
        await createUser(userId);
        const result = await createDeck(userId, tema);
        
        if (result.success) {
            await interaction.reply({ content: result.message, ephemeral: result.ephemeral });
        } else {
            await interaction.reply({ content: result.message, ephemeral: result.ephemeral });
        }
    }
};
