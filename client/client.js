const { CommandoClient } = require('discord.js-commando')
const FeedMonitor = require('../services/FeedMonitor')
const GuildSetting = require('../settings/GuildSetting')
const StatusUpdater = require('@tmware/status-rotate')
const Ranker = require('../services/Ranker')
const BadgeManager = require('../services/BadgeManager')

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

        const { firebaseApp, database, databaseRef } = require('../firebase.js');

        this.firebaseApp = firebaseApp
        this.database = database
        this.databaseRef = databaseRef
    }
};