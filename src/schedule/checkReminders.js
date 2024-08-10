const db = require('../db/database');
const Reminder = require('../services/reminderService');

async function checkReminder(client) {
    if (!client || !client.isReady()) {
        console.error('Discord client is not ready or not properly imported');
        return;
    }

    const now = new Date();
    const reminders = await db.runQuery('SELECT * FROM reminders WHERE reminder_time <= ?', [now]);

    for (const row of reminders) {
        const reminder = new Reminder(row.user_id, row.message, new Date(row.reminder_time), row.recurring);
        
        await reminder.sendReminder(client);

        if (row.recurring !== 'none') {
            const nextReminderTime = getNextReminderTime(reminder.reminderTime, reminder.intervalType);
            await db.runQuery('UPDATE reminders SET reminder_time = ? WHERE reminder_id = ?', [nextReminderTime, row.reminder_id]);
        } else {
            await db.runQuery('DELETE FROM reminders WHERE reminder_id = ?', [row.reminder_id]);
        }
    }
}

function getNextReminderTime(currentTime, intervalType) {
    const nextTime = new Date(currentTime);
    switch (intervalType) {
        case 'daily':
            nextTime.setDate(nextTime.getDate() + 1);
            break;
        case 'weekly':
            nextTime.setDate(nextTime.getDate() + 7);
            break;
    }
    return nextTime;
}

module.exports = { checkReminder };
