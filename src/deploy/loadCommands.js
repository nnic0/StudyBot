const fs = require('fs');
const path = require('node:path');
const { Collection } = require('discord.js');

module.exports = (client) => {
    // Cargar comandos de Slash
    const foldersPath = path.join(__dirname, '..', 'commands', 'slash');
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
            } else {
                console.error(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }

    // Cargar comandos de texto
    const textFoldersPath = path.join(__dirname, '..', 'commands', 'text');
    const textCommandFolders = fs.readdirSync(textFoldersPath);

    for (const folder of textCommandFolders) {
        const commandsPath = path.join(textFoldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            if ('name' in command && 'execute' in command) {
                client.textCommands.set(command.name, command);
            } else {
                console.log(`[WARNING] The text command at ${filePath} is missing a required "name" or "execute" property.`);
            }
        }
    }
};
