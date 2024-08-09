const { activeTimers } = require('../../../services/timerService.js');
module.exports = {
    name: 'stop-pomo',
    description: 'Frena tu sesión antes de tiempo',
    async execute(message) {
        const userId = message.author.id;
        if (activeTimers.has(userId)) {
            const timer = activeTimers.get(userId);
            await timer.stop();
        } else {
            message.reply('No tenés una sesión de Pomodoro en curso.');
        }
    },
};
