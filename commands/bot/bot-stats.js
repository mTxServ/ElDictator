const mTxServCommand = require('../mTxServCommand.js');
require('moment-duration-format');

module.exports = class BotStatsCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'stats',
            aliases: ['bot-stats'],
            group: 'bot',
            memberName: 'stats',
            description: 'Display bot stats.',
            guarded: true,
        });
    }

    run(msg) {
        const lang = require(`../../languages/${this.resolveLangOfMessage(msg)}.json`)
        return this.sayMessage(msg, lang['stats']['servers'].replace('%count%', this.formatNumber(this.client.guilds.cache.size)))
    }
};