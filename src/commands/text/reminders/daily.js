const { createUser } = require('../../../services/userService');
const Reminder = require('../../../services/reminderService'); // Asegúrate de colocar la ruta correcta

function formatTime(date) {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

function isValidTimeFormat(timeString) {
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(timeString);
}

module.exports = {
    name: 'daily',
    usage: '<tarea> <hora:min>',
    description: 'Agrega un recordatorio para una hora todos los días.',
    async execute(message, args) {
        if (args.length < 2) {
            return message.reply('Por favor, proporciona una tarea y la hora en formato <hora:min>. Ejemplo: `!daily Estudiar 14:30`');
        }

        const reminderMessage = args.slice(0, -1).join(' ');
        const timeString = args[args.length - 1];

        if (!isValidTimeFormat(timeString)) {
            return message.reply('Por favor, proporciona una hora válida en formato HH:MM (00:00 - 23:59).');
        }

        const [hour, minute] = timeString.split(':').map(Number);

        // Asegúrate de que el usuario exista en la base de datos
        await createUser(message.author.id);

        const now = new Date();
        const reminderTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0);

        // Instancia la clase Reminder
        const reminder = new Reminder(
            message.author.id,
            reminderMessage,
            reminderTime,
            'daily', // Establece el tipo de intervalo como 'daily'
            message.channel.id // Utiliza el canal donde se envió el comando
        );

        // Agrega y programa el recordatorio
        try {
            await reminder.addReminder();
            message.reply(`Recordatorio diario establecido para las ${formatTime(reminderTime)}: "${reminderMessage}"`);
        } catch (error) {
            console.error('Error al agregar el recordatorio:', error);
            message.reply('Hubo un problema al intentar establecer tu recordatorio.');
        }
    },
};
