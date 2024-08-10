const db = require('../../../db/database');

module.exports = {
    name: 'listreminders',
    description: 'Lista de todos los recordatorios que están activos',
    async execute(message, args) {
        try {
            const sql = `SELECT message, reminder_time, recurring FROM reminders WHERE user_id = ?`;
            const reminders = await db.runQuery(sql, [message.author.id]);

            if (reminders.length === 0) {
                return message.reply('No tienes recordatorios activos.');
            }

            let response = 'Estos son tus recordatorios activos:\n';
            reminders.forEach((reminder, index) => {
                response += `${index + 1}. ${reminder.message} - ${new Date(reminder.reminder_time).toLocaleString()} (${reminder.recurring})\n`;
            });

            message.reply(response);
        } catch (error) {
            console.error('Error al listar los recordatorios:', error);
            message.reply('Hubo un problema al intentar listar tus recordatorios.');
        }
    },
};
