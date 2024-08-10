const { Interaction, Client, Collection, SlashCommandBuilder } = require('discord.js');
const { Timer } = require('../../../services/timerService');
const { config } = require('../../../services/configService');
const { createUser } = require('../../../services/userService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start-group-pomo')
        .setDescription('Inicia una sesión Pomodoro en grupo')
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
            const members = interaction.client.groups?.get(interaction.user.id);
        
            if (!members || members.length === 0) {
                return interaction.reply({ content: 'No hay ningún grupo creado.', ephemeral: true });
            }

            let workTime, relaxTime;

            switch (tiempo) {
                case 0:
                    workTime = 25;
                    relaxTime = 5;
                    break;
                case 1:
                    workTime = 30;
                    relaxTime = 10;
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
                    await interaction.reply('Opción de tiempo no válida.');
                    return;
            }

            const timer = new Timer(interaction, workTime, relaxTime, members);
            await timer.start();

        } catch(error) {
            console.error('Error en execute:', error);
            if (!interaction.replied) {
                await interaction.reply('Hubo un error al procesar tu solicitud.');
            }
        }
    },
};