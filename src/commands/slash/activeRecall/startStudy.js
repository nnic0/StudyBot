const { SlashCommandBuilder } = require('discord.js');
const { ActiveRecall } = require('../../../services/activeRecallService');
const { createUser } = require('../../../services/userService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('active-recall')
        .setDescription('Empezá a estudiar con el método active recall')
        .addStringOption(option =>
            option.setName('nombre')
                .setDescription('Nombre del mazo a estudiar')
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            const nombre = interaction.options.getString('nombre');
            const userId = interaction.user.id;

            await createUser(userId);

            const activeRecall = new ActiveRecall(interaction, nombre);
            await activeRecall.start();
        } catch (error) {
            console.error('Error en execute:', error);
            if (!interaction.replied) {
                await interaction.reply({content: 'Hubo un error al procesar tu solicitud.', ephemeral: true});
            }
        }
    },
};
