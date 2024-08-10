const { Client, GatewayIntentBits, Collection } = require('discord.js');
const path = require('node:path');
const fs = require('fs');
require('dotenv').config();

// Configuración del cliente
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]
});

client.commands = new Collection();
client.textCommands = new Collection();

require('../src/deploy/loadCommands')(client);
require('../src/deploy/loadEvents')(client);

client.login(process.env.BOT_TOKEN);

module.exports = { client };
