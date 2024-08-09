const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { getUserProfile } = require('../../../services/userService');
const colors = require('../../../utils/colors');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Observa tu perfil junto con todas tus estadísticas')
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('El usuario cuyo perfil quieres ver')
                .setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('usuario') || interaction.user;
        const userId = user.id;

        const formatTime = (minutes) => {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return `${hours > 0 ? `${hours}h ` : ''}${mins}min`;
        };

        try {
            const profileData = await getUserProfile(userId);

            if (!profileData) {
                return interaction.reply('No se encontró el perfil del usuario.');
            }

            const { stats, tasks, topics } = profileData;

            const embed = new EmbedBuilder()
                .setTitle(`📚 Perfil de ${user.globalName}`)
                .setThumbnail(user.displayAvatarURL())
                .setColor(colors.ORANGE);

            if (stats && stats.length > 0) {
                embed.addFields(
                    { name: '📌 Pomodoro', value: `\`\`\`swift\n✅ Pomodoros totales » ${stats[0].pomodoro_tot?.toString() || '0'}\n⏱ Tiempo en Pomodoro » ${formatTime(stats[0].minutes_pom || 0)}\`\`\``, inline: false },
                );

                embed.addFields(
                    { name: '📌 Active Recall', value: `\`\`\`swift\n⏱ Tiempo en Active Recall » ${formatTime(stats[0].minutes_act || 0)}\n📝 Tarjetas estudiadas » ${stats[0].cards_studied?.toString() || '0'}\`\`\``, inline: false },
                );
            }

            if (tasks && tasks.length > 0) {
                embed.addFields(
                    { name: '📌 To-do', value: `\`\`\`swift\n💼 Tareas creadas » ${tasks[0].total_tasks?.toString() || '0'}\n✅ Tareas realizadas » ${tasks[0].tasks_completed?.toString() || '0'}\n⏱ Prom. en terminar tareas » ${formatTime(tasks[0].avg_completion_time || 0)}\`\`\``, inline: false },
                );
            }

            if (topics && topics.length > 0) {
                embed.addFields({ name: '📌 Mazos', value: ' ' });
                topics.forEach(topic => {
                    embed.addFields(
                        { name: ` `, value: `\`\`\`swift\n📚 Tema:\n${topic.topic_name}\nTarjetas » ${topic.total_cards}\`\`\``, inline: true }
                    );
                });
            }

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error al obtener el perfil:', error);
            await interaction.reply('Hubo un error al obtener el perfil del usuario.');
        }
    }
};
