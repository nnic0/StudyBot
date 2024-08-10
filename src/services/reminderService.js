const db = require('../db/database');
const cron = require('node-cron');

class Reminder {
    constructor(userId, reminderText, reminderTime, intervalType, channelId) {
        this.userId = userId;
        this.reminderText = reminderText;
        this.reminderTime = reminderTime;
        this.intervalType = intervalType; // daily, weekly, etc.
        this.channelId = channelId;
    }

    async addReminder() {
        try {
            const sql = `INSERT INTO reminders (user_id, message, reminder_time, recurring) VALUES (?, ?, ?, ?)`;
            await db.runQuery(sql, [this.userId, this.reminderText, this.reminderTime, this.intervalType]);
            console.log('Reminder added successfully');
            this.scheduleReminder();
        } catch (err) {
            console.error('Error adding reminder:', err);
        }
    }

    static async removeReminder(userId, reminderText) {
        try {
            const sql = `DELETE FROM reminders WHERE user_id = ? AND message = ?`;
            await db.runQuery(sql, [userId, reminderText]);
            console.log('Reminder removed successfully');
        } catch (err) {
            console.error('Error removing reminder:', err);
        }
    }

    scheduleReminder(client) {
        const cronExpression = this.getCronExpression();
        cron.schedule(cronExpression, () => {
            this.sendReminder(client);
        });
    }

    getCronExpression() {
        switch (this.intervalType) {
            case 'daily':
                return `${this.reminderTime.getMinutes()} ${this.reminderTime.getHours()} * * *`;
            case 'weekly':
                return `${this.reminderTime.getMinutes()} ${this.reminderTime.getHours()} * * ${this.reminderTime.getDay()}`;
            case 'monthly':
                return `${this.reminderTime.getMinutes()} ${this.reminderTime.getHours()} ${this.reminderTime.getDate()} * *`;
            default:
                return `${this.reminderTime.getMinutes()} ${this.reminderTime.getHours()} * * *`;
        }
    }

    async sendReminder(client) {
        if (!client) {
            console.error('Discord client is not provided to sendReminder method');
            return;
        }
    
        try {
            if (!client.users || !client.users.fetch) {
                console.error('Client is not fully initialized. Ensure the bot is logged in and users are cached.');
                return;
            }
    
            const user = await client.users.fetch(this.userId);
            if (user) {
                await user.send(`Recordatorio: ${this.reminderText}`);
            } else {
                console.error(`User ${this.userId} not found`);
            }
        } catch (error) {
            if (error.code === 50007) {
                console.log(`Unable to send DM to user ${this.userId}. Attempting to send in a server channel.`);
                try {
                    const guild = client.guilds.cache.first();
                    if (!guild) {
                        console.error('No guild found for sending server message');
                        return;
                    }
    
                    const channel = guild.channels.cache.find(ch => ch.type === 'GUILD_TEXT' && ch.permissionsFor(guild.me).has('SEND_MESSAGES'));
                    if (channel) {
                        await channel.send(`<@${this.userId}>, Recordatorio: ${this.reminderText}`);
                    } else {
                        console.error('No suitable text channel found in the guild');
                    }
                } catch (channelError) {
                    console.error('Error sending reminder in server channel:', channelError);
                }
            } else {
                console.error('Error sending reminder:', error);
            }
        }
    }
    
    
    
    
}

module.exports = Reminder;
