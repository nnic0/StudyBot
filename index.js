const fs = require("node:fs");
const path = require("node:path");
const { REST, Routes } = require('discord.js');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const database = require("./src/db/database");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
require('dotenv').config();

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.BOT_TOKEN;


client.commands = new Collection(); 
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'src/commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command); // Agrega el comando a la colección
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);
const commandData = client.commands.map(command => command.data.toJSON());
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commandData })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);

const eventsPath = path.join(__dirname, 'src/events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token);

module.exports = client;