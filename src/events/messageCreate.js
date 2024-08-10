const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        const prefix = '!';

        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = message.client.textCommands.get(commandName);

        if (!command) return;

        try {
            await command.execute(message, args);
        } catch (error) {
            console.error(error);
            await message.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    },
};