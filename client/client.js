const { CommandoClient } = require('discord.js-commando')
const FeedMonitor = require('../services/FeedMonitor')
const GuildSetting = require('../settings/GuildSetting')
const StatusUpdater = require('@tmware/status-rotate')

module.exports = class mTxServClient extends CommandoClient {
    constructor(options) {
        super(options);
        this.feedMonitor = new FeedMonitor(options.feeds);
        this.guildSettings = new GuildSetting()

        this.statusUpdater = new StatusUpdater(this, [
            { type: 'WATCHING', name: '{guilds} servers' },
            { type: 'PLAYING', name: `${process.env.BOT_COMMAND_PREFIX}help | mTxServ.com`},
            { type: 'PLAYING', name: 'Server by mTxServ.com' },
        ])
    }
};