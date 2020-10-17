const { CommandoClient } = require('discord.js-commando')
const FeedMonitor = require('../services/FeedMonitor')
const GuildSetting = require('../settings/GuildSetting')

module.exports = class mTxServClient extends CommandoClient {
    constructor(options) {
        super(options);
        this.feedMonitor = new FeedMonitor(options.feeds);
        this.guildSettings = new GuildSetting()
    }
};