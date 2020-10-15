const path = require('path')
const fs = require('fs')
const dotenv = require('dotenv')
const { SQLiteProvider } = require('discord.js-commando')
const sqlite = require('sqlite')
const Client = require('./client/client')

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
    },
    feeds: [
        {
            url: 'https://hytale.game/p/index.rss',
            channelId: '726178171858190340',
            locale: ['fr']
        },
        {
            url: 'https://minecraft.fr/feed/',
            channelId: '726178171858190340',
            locale: ['fr']
        },
        {
            url: 'https://gmod.facepunch.com/rss/blog',
            channelId: '726178171858190340',
            locale: ['en']
        },
        {
            url: 'https://rust.facepunch.com/rss/blog',
            channelId: '726178171858190340',
            locale: ['en', 'fr']
        },
        {
            url: 'https://sandbox.facepunch.com/rss/news',
            channelId: '726178171858190340',
            locale: ['en', 'fr']
        }
    ]
});

client.setProvider(
    sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new SQLiteProvider(db))
).catch(console.error);

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
        ['mtxserv', 'Main'],
        ['bot', 'Bot'],
        ['news', 'News'],
        ['admin', 'Admin'],
        ['howto', 'How-To'],
        ['partner', 'Partner'],
        ['gmod', 'GMod Server'],
        ['minecraft', 'Minecraft Server'],
        ['gameserver', 'Game Server'],
        ['gameserverstatus', 'Game Server Status'],
        ['convert', 'Conversion'],
        ['image', 'Image'],
        ['random', 'Random'],
    ])
    .registerCommandsIn(path.join(__dirname, 'commands'))
;

client.login(isDev ? process.env.BOT_TOKEN_DEV : process.env.BOT_TOKEN)
