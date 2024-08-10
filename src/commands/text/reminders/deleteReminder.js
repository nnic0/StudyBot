const Reminder = require('../../../services/reminderService');

module.exports = {
    name: 'removereminder',
    usage: '<tarea>',
    description: 'Elimina un recordatorio activo.',
    async execute(message, args) {
        if (args.length === 0) {
            return message.reply('Por favor, proporciona la tarea del recordatorio que deseas eliminar. Ejemplo: `!removereminder Estudiar`');
        }

        const reminderMessage = args.join(' ');

        try {
            await Reminder.removeReminder(message.author.id, reminderMessage);
            message.reply(`El recordatorio "${reminderMessage}" ha sido eliminado.`);
        } catch (error) {
            console.error('Error al eliminar el recordatorio:', error);
            message.reply('Hubo un problema al intentar eliminar tu recordatorio.');
        }
    },
};
