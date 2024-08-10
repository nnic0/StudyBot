const { createUser } = require('../../../services/userService');
const Reminder = require('../../../services/reminderService');
const moment = require('moment'); 

function isValidTimeFormat(timeString) {
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(timeString);
}

module.exports = {
    name: 'monthly',
    usage: '<tarea> <día-mes hora:min>',
    description: 'Agrega un recordatorio mensual para una fecha y hora específicas cada mes.',
    async execute(message, args) {
        if (args.length < 2) {
            return message.reply('Por favor, proporciona una tarea y la hora en formato <día-mes hora:min>. Ejemplo: `!monthly Pagar alquiler 01 10:00`');
        }

        const reminderMessage = args.slice(0, -2).join(' ');
        const dayOfMonth = parseInt(args[args.length - 2], 10);
        const timeString = args[args.length - 1];

        if (isNaN(dayOfMonth) || dayOfMonth < 1 || dayOfMonth > 31) {
            return message.reply('Por favor, proporciona un día válido del mes (1-31).');
        }

        if (!isValidTimeFormat(timeString)) {
            return message.reply('Por favor, proporciona una hora válida en formato HH:MM (00:00 - 23:59).');
        }

        const [hour, minute] = timeString.split(':').map(Number);

        await createUser(message.author.id);

        const now = new Date();
        let reminderTime = moment().date(dayOfMonth).hour(hour).minute(minute).second(0).toDate();

        if (reminderTime < now) {
            reminderTime = moment(reminderTime).add(1, 'month').toDate();
        }

        const reminder = new Reminder(
            message.author.id,
            reminderMessage,
            reminderTime,
            'monthly', 
            message.channel.id
        );

        try {
            await reminder.addReminder();
            message.reply(`Recordatorio mensual establecido para el día ${dayOfMonth} de cada mes a las ${timeString}: "${reminderMessage}"`);
        } catch (error) {
            console.error('Error al agregar el recordatorio:', error);
            message.reply('Hubo un problema al intentar establecer tu recordatorio.');
        }
    },
};
