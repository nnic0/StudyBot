const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getAllTasks } = require('../../services/taskService.js');
const { createUser } = require('../../services/userService.js');
const colors = require('../../utils/colors.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tasks')
        .setDescription('Muestra tus tareas')
        .addStringOption(option =>
            option.setName('filtrar')
                .setDescription('Filtrar tareas')
                .setRequired(false)
                .addChoices(
                    { name: 'Todas', value: 'all' },
                    { name: 'Completadas', value: 'done' },
                    { name: 'Pendientes', value: 'pending' }
                )),
    async execute(interaction) {
        const userId = interaction.user.id;
        const filter = interaction.options.getString('filtrar') || 'all';
        
        try {
            await createUser(userId);
            let tasks = await getAllTasks(userId);
            
            if (filter === 'done') {
                tasks = tasks.filter(task => task.task_done);
            } else if (filter === 'pending') {
                tasks = tasks.filter(task => !task.task_done);
            }

            if (tasks.length === 0) {
                await interaction.reply({content: 'No tienes tareas que coincidan con el filtro seleccionado.', ephemeral: true});
                return;
            }

            const embed = new EmbedBuilder()
                .setTitle('To-do List')
                .setDescription(getDescription(filter))
                .setColor(colors.BLUE)

            tasks.forEach(task => {
                embed.addFields({
                    name: ` `,
                    value: `**${task.task}** ${task.task_done ? '✅' : '❌'}\nCreada: ${task.created_at.toLocaleString()} **ID: ${task.task_id}**`
                });
            });

            await interaction.reply({ 
                embeds: [embed], 
                ephemeral: true 
            });
        } catch (error) {
            console.error('Error al obtener las tareas:', error);
            await interaction.reply({content: 'Hubo un error al obtener tus tareas. Por favor, inténtalo de nuevo.', ephemeral: true});
        }
    },
};

function getDescription(filter) {
    switch (filter) {
        case 'done':
            return '¡Tus tareas completadas!';
        case 'pending':
            return '¡Tus tareas pendientes!';
        default:
            return '¡Todas tus tareas, pendientes y completadas!';
    }
}