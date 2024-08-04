const { Events, ActivityType } = require('discord.js');
const { configBotProfile } = require('../config/botConfig');

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

    },
};