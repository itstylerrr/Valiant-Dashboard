const config = require('./config.json');
const { init } = require("./dashboard");
const DarkDashboard = require('dbd-dark-dashboard');
const DBD = require("discord-dashboard");
const mongoose = require("mongoose");
const guildSchema = require("./Database/Schemas/Guild");
let langsSettings = {};

/* --- DISCORD.JS CLIENT --- */

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: 131071 });

client.on("ready", (client) => {
    init(client);
});

client.login(config.token);