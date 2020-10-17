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
            channels: ['694460936748269609'],
            icon: 'https://hytale.com/favicon.ico'
        },
        {
            url: 'https://minecraft.fr/feed/',
            channels: ['694460936748269609'],
            icon: 'https://mtxserv.com/build/manager-game/img/game/minecraft.png'
        },
        {
            url: 'https://gmod.facepunch.com/rss/blog',
            channels: ['703151209833299980'],
            icon: 'https://mtxserv.com/build/manager-game/img/game/garry-s-mod.png'
        },
        {
            url: 'https://rust.facepunch.com/rss/blog',
            channels: ['766367859210977310'],
            icon: 'https://mtxserv.com/build/manager-game/img/game/rust.png'
        },
        {
            url: 'https://sandbox.facepunch.com/rss/news',
            channels: ['703151209833299980'],
            icon: null
        },
        {
            url: 'https://survivetheark.com/index.php?/rss/3-ark-news.xml/',
            channels: ['751700547928850493'],
            icon: 'https://mtxserv.com/build/manager-game/img/game/ark.png'
        },
        {
            url: 'https://ark-france.fr/rss/1-flux-rss-news.xml/',
            channels: ['751700547928850493'],
            icon: 'https://mtxserv.com/build/manager-game/img/game/ark.png'
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
