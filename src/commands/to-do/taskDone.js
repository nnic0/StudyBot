const { SlashCommandBuilder } = require('discord.js');
const { completeTask } = require('../../utils/task');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('donetask')
        .setDescription('Marca una tarea como completada')
        .addIntegerOption(option => 
            option.setName('task-id')
                .setDescription('ID de la tarea a completar')
                .setRequired(true)),

    async execute(interaction) {
        const userId = interaction.user.id;
        const taskId = interaction.options.getInteger('task-id');

        try {
            const result = await completeTask(userId, taskId);
            await interaction.reply(result.message);
        } catch (error) {
            console.error('Error en el comando complete-task:', error);
            await interaction.reply('Hubo un error al procesar tu comando. Por favor, inténtalo de nuevo.');
        }
    },
};