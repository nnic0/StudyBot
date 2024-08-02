const { Interaction, Client, Collection, SlashCommandBuilder } = require('discord.js');
const { activeTimers } = require('../../utils/timer'); // Ensure you export activeTimers from your timer file

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Frena tu sesión antes de tiempo'),
    async execute(interaction) {
        const userId = interaction.user.id;
        if (activeTimers.has(userId)) {
            const timer = activeTimers.get(userId);
            await timer.stop();
        } else {
            await interaction.reply({ content: 'No tenés una sesión de Pomodoro en curso.', ephemeral: true });
        }
    },
};
