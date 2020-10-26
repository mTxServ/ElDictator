const { CommandoClient, SQLiteProvider } = require('discord.js-commando')
const FeedMonitor = require('../services/FeedMonitor')
const GuildSetting = require('../settings/GuildSetting')
const StatusUpdater = require('@tmware/status-rotate')
const Ranker = require('../services/Ranker')
const BadgeManager = require('../services/BadgeManager')
const FirebaseProvider = require('../provider/FirebaseProvider')
const sqlite = require('sqlite')
const path = require('path')

module.exports = class mTxServClient extends CommandoClient {
    constructor(options) {
        super(options);

        this.feedMonitor = new FeedMonitor(options.feeds);
        this.guildSettings = new GuildSetting()
        this.ranker = new Ranker()
        this.badger = new BadgeManager()

        this.statusUpdater = new StatusUpdater(this, [
            { type: 'PLAYING', name: `${process.env.BOT_COMMAND_PREFIX}help | mTxServ.com`},
            { type: 'PLAYING', name: 'Server by mTxServ.com' },
        ])
    }

    async initProvider() {
        const self = this

        sqlite.open(path.join(__dirname, '../settings.sqlite3'))
            .then(function (db) {
                const sqlite = new SQLiteProvider(db)
                sqlite.init(self)

                const provider = new FirebaseProvider(sqlite)
                self.setProvider(provider).catch(console.error)
            })
    }
};