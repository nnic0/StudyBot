const fs = require("fs");
const path = require("node:path");
const { REST, Routes } = require('discord.js');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { Player, QueryType } = require("discord-player");
const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildVoiceStates  // Añade este intent
    ]
});
  
require('dotenv').config();

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.BOT_TOKEN;

client.commands = new Collection();
client.textCommands = new Collection(); // Para comandos escritos

// Cargar Slash Commands
const foldersPath = path.join(__dirname, 'commands', 'slash');
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

// Cargar Text Commands
const textFoldersPath = path.join(__dirname, 'commands', 'text');
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

// Registrar Slash Commands con Discord API
const rest = new REST().setToken(token);
const commandData = client.commands.map(command => command.data.toJSON());
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commandData })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);

// Cargar Eventos
const eventsPath = path.join(__dirname, 'events');
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

console.log(client.commands);
console.log(client.textCommands);

client.login(token);

const player = new Player(client);

player.on("error", (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
});
player.on("connectionError", (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
});

player.on("trackStart", (queue, track) => {
    queue.metadata.send(`🎶 | Started playing: **${track.title}** in **${queue.connection.channel.name}**!`);
});

player.on("trackAdd", (queue, track) => {
    queue.metadata.send(`🎶 | Track **${track.title}** queued!`);
});

player.on("botDisconnect", (queue) => {
    queue.metadata.send("❌ | I was manually disconnected from the voice channel, clearing queue!");
});

player.on("channelEmpty", (queue) => {
    queue.metadata.send("❌ | Nobody is in the voice channel, leaving...");
});

player.on("queueEnd", (queue) => {
    queue.metadata.send("✅ | Queue finished!");
});

module.exports = client;
