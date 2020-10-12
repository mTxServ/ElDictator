const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv')
const { Client } = require('discord.js-commando');

// load local env configuration
const envConfig = dotenv.parse(fs.readFileSync('.env'))
for (const k in envConfig) {
    process.env[k] = envConfig[k]
}

const isDev = global.isDev = process.argv.includes('-dev')

// create discord bot
const client = global.client = new Client({
    commandPrefix: process.env.BOT_COMMAND_PREFIX,
    owner: process.env.BOT_OWNER_ID,
    invite: process.env.BOT_INVITE_URL,
    presence: {
        activity: {
            name: `${process.env.BOT_COMMAND_PREFIX}help | mTxServ.com`,
            type: 0
        }
    }
});

fs.readdir('./events/', (err, files) => {
    if (err) return console.error(err);
    files.forEach((file) => {
        const eventFunction = require(`./events/${file}`);
        if (eventFunction.disabled) return;

        const event = eventFunction.event || file.split('.')[0];
        const emitter = (typeof eventFunction.emitter === 'string' ? client[eventFunction.emitter] : eventFunction.emitter) || client;
        const { once } = eventFunction;

        try {
            emitter[once ? 'once' : 'on'](event, (...args) => eventFunction.run(...args));
        } catch (error) {
            console.error(error.stack);
        }
    });
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['mtxserv', 'Main commands'],
        ['admin', 'Admin commands'],
        ['howto', 'How-To commands'],
        ['partner', 'Partner commands'],
        ['gameserver', 'Game Server commands'],
        ['code', 'Code commands'],
    ])
    .registerCommandsIn(path.join(__dirname, 'commands'))
;

client.login(isDev ? process.env.BOT_TOKEN_DEV : process.env.BOT_TOKEN)
