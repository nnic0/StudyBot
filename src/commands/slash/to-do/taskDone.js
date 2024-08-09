const { SlashCommandBuilder } = require('discord.js');
const { completeTask } = require('../../../services/taskService.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('todo-done')
        .setDescription('Marca una tarea como completada')
        .addStringOption(option => 
            option.setName('task-name')
                .setDescription('Nombre de la tarea a completar')
                .setRequired(true)),

    async execute(interaction) {
        const userId = interaction.user.id;
        const taskName = interaction.options.getString('task-name');

        try {
            const result = await completeTask(userId, taskName);
            await interaction.reply({content: result.message, ephemeral: true});
        } catch (error) {
            console.error('Error en el comando complete-task:', error);
            await interaction.reply({content: 'Hubo un error al procesar tu comando. Por favor, inténtalo de nuevo.', ephemeral: true});
        }
    },
};