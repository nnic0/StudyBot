const { SlashCommandBuilder } = require('discord.js');
const { deleteTask } = require('../../services/taskService.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete-task')
        .setDescription('Elimina una tarea')
        .addIntegerOption(option => 
            option.setName('task-id')
                .setDescription('ID de la tarea a eliminar')
                .setRequired(true)),

    async execute(interaction) {
        const userId = interaction.user.id;
        const taskId = interaction.options.getInteger('task-id');

        try {
            const result = await deleteTask(userId, taskId);
            await interaction.reply({ content: result.message, ephemeral: true });
        } catch (error) {
            console.error('Error en el comando delete-task:', error);
            await interaction.reply({ content: 'Hubo un error al procesar tu comando. Por favor, inténtalo de nuevo.', ephemeral: true });
        }
    },
};