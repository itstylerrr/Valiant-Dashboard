const config = require('./config.json');
const { init } = require("./dashboard");

/* --- DISCORD.JS CLIENT --- */

const { Client } = require('discord.js');
const client = new Client({ intents: 131071 });

client.on("ready", (client) => {
    init(client);
});

client.login(config.token);