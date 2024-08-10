const { createUser } = require('../../../services/userService');
const Reminder = require('../../../services/reminderService');
const moment = require('moment'); // Para manejar las fechas y horas

function isValidTimeFormat(timeString) {
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(timeString);
}

module.exports = {
    name: 'weekly',
    usage: '<tarea> <día-semana hora:min>',
    description: 'Agrega un recordatorio semanal para una hora específica cada semana.',
    async execute(message, args) {
        if (args.length < 2) {
            return message.reply('Por favor, proporciona una tarea y la hora en formato <día-semana hora:min>. Ejemplo: `!weekly Estudiar lunes 14:30`');
        }

        const reminderMessage = args.slice(0, -2).join(' ');
        const dayOfWeek = args[args.length - 2].toLowerCase();
        const timeString = args[args.length - 1];

        const daysOfWeek = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

        if (!daysOfWeek.includes(dayOfWeek)) {
            return message.reply('Por favor, proporciona un día válido de la semana (ej: lunes, martes).');
        }

        if (!isValidTimeFormat(timeString)) {
            return message.reply('Por favor, proporciona una hora válida en formato HH:MM (00:00 - 23:59).');
        }

        const [hour, minute] = timeString.split(':').map(Number);

        await createUser(message.author.id);

        const now = new Date();
        let reminderTime = moment().day(dayOfWeek).hour(hour).minute(minute).second(0).toDate();

        if (reminderTime < now) {
            reminderTime = moment(reminderTime).add(1, 'week').toDate();
        }

        const reminder = new Reminder(
            message.author.id,
            reminderMessage,
            reminderTime,
            'weekly',
            message.channel.id
        );

        try {
            await reminder.addReminder();
            message.reply(`Recordatorio semanal establecido para cada ${dayOfWeek} a las ${timeString}: "${reminderMessage}"`);
        } catch (error) {
            console.error('Error al agregar el recordatorio:', error);
            message.reply('Hubo un problema al intentar establecer tu recordatorio.');
        }
    },
};
