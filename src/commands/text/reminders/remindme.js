const { createUser } = require('../../../services/userService');
const Reminder = require('../../../services/reminderService');
const moment = require('moment');

function isValidDateFormat(dateString) {
    return /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/.test(dateString);
}

module.exports = {
    name: 'remindme',
    usage: '<tarea> <día-mes-año hora:min>',
    description: 'Agrega un recordatorio para una fecha y hora específicas.',
    async execute(message, args) {
        if (args.length < 2) {
            return message.reply('Por favor, proporciona una tarea y la fecha/hora en formato <día-mes-año hora:min>. Ejemplo: `!remindme Examen 15-08-2024 14:30`');
        }

        const reminderMessage = args.slice(0, -2).join(' ');
        const dateTimeString = `${args[args.length - 2]} ${args[args.length - 1]}`;

        if (!isValidDateFormat(dateTimeString)) {
            return message.reply('Por favor, proporciona una fecha y hora válidas en formato DD-MM-YYYY HH:MM.');
        }

        const reminderTime = moment(dateTimeString, 'DD-MM-YYYY HH:mm').toDate();

        if (reminderTime < new Date()) {
            return message.reply('La fecha y hora deben ser en el futuro.');
        }

        await createUser(message.author.id);

        const reminder = new Reminder(
            message.author.id,
            reminderMessage,
            reminderTime,
            'none',
            message.channel.id
        );

        try {
            await reminder.addReminder();
            message.reply(`Recordatorio establecido para el ${moment(reminderTime).format('DD-MM-YYYY HH:mm')}: "${reminderMessage}"`);
        } catch (error) {
            console.error('Error al agregar el recordatorio:', error);
            message.reply('Hubo un problema al intentar establecer tu recordatorio.');
        }
    },
};
