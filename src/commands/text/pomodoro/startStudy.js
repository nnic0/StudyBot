const { Timer } = require('../../../services/timerService');
const database = require('../../../db/database');
const { config } = require('../../../services/configService');
const { createUser } = require('../../../services/userService');

module.exports = {
    name: 'pomodoro',
    description: 'Empezá a estudiar con pomodoro',
    args: true,
    usage: '<tiempo>',
    async execute(message, args) {
        try {
            const tiempo = parseInt(args[0]);
            const userId = message.author.id;
            await createUser(userId);

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
                    const customTimes = await config(userId);
                    if (customTimes) {
                        workTime = customTimes.work_time;
                        relaxTime = customTimes.relax_time;
                    } else {
                        message.reply('No se encontraron configuraciones personalizadas. Por favor, configura tus tiempos primero con el comando !config.');
                        return;
                    }
                    break;
                default:
                    message.reply('Opción de tiempo no válida. Usá !pomodoro <0|1|2>');
                    return;
            }

            const timer = new Timer(message, workTime, relaxTime);
            await timer.start();

        } catch (error) {
            console.error('Error en execute:', error);
            message.reply('Hubo un error al procesar tu solicitud.');
        }
    },
};
