const { Events, ActivityType } = require('discord.js');
const { configBotProfile } = require('../config/botConfig');
const { checkReminder } = require('../schedule/checkReminders');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);

        await configBotProfile(client, {
            newUsername: 'StudyBot',
            avatarPath: 'StudyBot.png',
            activity: 'tarjetas de memoria...',
            activityType: ActivityType.Watching,
            status: 'online'
        });
        
        setInterval(() => {
            checkReminder(client)
        }, 60000);


    },
};