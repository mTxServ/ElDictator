const { CommandoClient } = require('discord.js-commando')
const FeedMonitor = require('../services/FeedMonitor')

module.exports = class mTxServClient extends CommandoClient {
    constructor(options) {
        super(options);
        this.feedMonitor = new FeedMonitor(options.feeds);
    }
};