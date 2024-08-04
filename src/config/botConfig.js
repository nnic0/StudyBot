const fs = require('fs');
const path = require('path');
const { ActivityType } = require('discord.js');

async function configBotProfile(client, options = {}) {
    const {
        newUsername,
        avatarPath,
        activity,
        activityType,
        status,
        aboutMe
    } = options;

    try {
        if (newUsername) {
            await client.user.setUsername(newUsername);
        }

        if (avatarPath) {
            const avatar = fs.readFileSync(path.join(__dirname, avatarPath));
            await client.user.setAvatar(avatar);
        }

        if (aboutMe) {
            await client.user.setPresence({
                activities: [{ name: aboutMe, type: ActivityType.Custom }],
                status: status || 'online'
            });
        } else if (activity) {
            await client.user.setPresence({
                activities: [{ name: activity, type: activityType || ActivityType.Playing }],
                status: status || 'online'
            });
        }
    } catch (error) {
        console.error('Error al actualizar el bot:', error);
    }
}

module.exports = { configBotProfile };
