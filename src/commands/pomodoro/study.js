const { SlashCommandBuilder } = require('discord.js');
const { Timer } = require('../../services/timerService'); // Asegúrate de que la ruta sea correcta
const database = require('../../db/database'); // Asegúrate de que la ruta sea correcta
const { config } = require('../../services/configService');
const { createUser } = require('../../services/userService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pomodoro')
        .setDescription('Empezá a estudiar con pomodoro')
        .addIntegerOption(option =>
            option.setName('tiempo')
                .setDescription('Selecciona el tiempo en minutos')
                .setRequired(true)
                .addChoices([
                    { name: 'Clásico (25 min trabajo, 5 min descanso)', value: 0 },
                    { name: 'Clásico+ (30 min trabajo, 10 min descanso)', value: 1 },
                    { name: 'Personalizado', value: 2 }
                ])
        ),
    async execute(interaction) {
        try {
            const tiempo = interaction.options.getInteger('tiempo');
            const userId = interaction.user.id;
            await createUser(userId);

            // Aquí puedes implementar la lógica para iniciar el temporizador
            let workTime, relaxTime;

            switch (tiempo) {
                case 0:
                    workTime = 25; // minutos
                    relaxTime = 5; // minutos
                    break;
                case 1:
                    workTime = 30; // minutos
                    relaxTime = 10; // minutos
                    break;
                case 2:
                    const customTimes = await config(interaction.user.id);
                    if (customTimes) {
                        workTime = customTimes.work_time;
                        relaxTime = customTimes.relax_time;
                    } else {
                        await interaction.reply('No se encontraron configuraciones personalizadas. Por favor, configura tus tiempos primero. Con el comando /config');
                        return;
                    }
                    break;
                default:
                    await interaction.reply({content: 'Opción de tiempo no válida.', ephemeral: true});
                    return;
            }

            // Inicia el temporizador
            const timer = new Timer(interaction, workTime, relaxTime);
            await timer.start();

        } catch (error) {
            console.error('Error en execute:', error);
            if (!interaction.replied) {
                await interaction.reply({content: 'Hubo un error al procesar tu solicitud.', ephemeral: true});
            }
        }
    },
};
