const { SlashCommandBuilder } = require('@discordjs/builders');
const task = require('../../services/taskService.js');
const { createUser } = require('../../services/userService.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-task')
        .setDescription('Agrega una nueva tarea a tu lista de tareas')
        .addStringOption(option => 
            option.setName('tarea')
                .setDescription('Descripción de la tarea')
                .setRequired(true)),
    async execute(interaction) {
        const tarea = interaction.options.getString('tarea');
        const userId = interaction.user.id;
        await createUser(userId);
        task.addTask(userId, tarea);

        await interaction.reply({ content: `Tarea añadida: ${tarea}`, ephemeral: true});
    }
};
