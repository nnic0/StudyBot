const { SlashCommandBuilder } = require('@discordjs/builders');
const card = require('../../utils/cards');
const { createUser } = require('../../utils/user');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('createdeck')
        .setDescription('Crea un mazo para crear tarjetas en el mismo.')
        .addStringOption(option => 
            option.setName('tema')
                .setDescription('Tema del mazo')
                .setRequired(true)),
    async execute(interaction) {
        const tema = interaction.options.getString('tema');
        const userId = interaction.user.id;
        await createUser(userId);
        card.createDeck(userId, tema);

        await interaction.reply({ content: `¡Tema añadido con exito: ${tema}!`, ephemeral: true});
    }
};
