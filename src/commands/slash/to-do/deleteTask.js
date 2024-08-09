const { SlashCommandBuilder } = require('discord.js');
const { deleteTask } = require('../../../services/taskService.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('todo-remove')
        .setDescription('Elimina una tarea')
        .addStringOption(option => 
            option.setName('task-name')
                .setDescription('Nombre de la tarea')
                .setRequired(true)),

    async execute(interaction) {
        const userId = interaction.user.id;
        const taskName = interaction.options.getString('task-name');

        try {
            const result = await deleteTask(userId, taskName);
            await interaction.reply({ content: result.message, ephemeral: true });
        } catch (error) {
            console.error('Error en el comando delete-task:', error);
            await interaction.reply({ content: 'Hubo un error al procesar tu comando. Por favor, inténtalo de nuevo.', ephemeral: true });
        }
    },
};