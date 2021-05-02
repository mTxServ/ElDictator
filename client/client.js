const { CommandoClient } = require('discord.js-commando')
const FeedMonitor = require('../services/FeedMonitor')
const InviteManager = require('../services/InviteManager')
const StatusUpdater = require('@tmware/status-rotate')
const Ranker = require('../services/Ranker')
const FirebaseProvider = require('../provider/FirebaseProvider')

module.exports = class mTxServClient extends CommandoClient {
    constructor(options) {
        super(options);

        this.gameRoles = options.gameRoles;
        this.feedMonitor = new FeedMonitor(options.feeds);
        //this.inviteManager = new InviteManager();
        this.ranker = new Ranker()

        this.statusUpdater = new StatusUpdater(this, [
            { type: 'PLAYING', name: `${process.env.BOT_COMMAND_PREFIX}giveaway | Win prizes!`},
            // { type: 'PLAYING', name: `${process.env.BOT_COMMAND_PREFIX}help | mTxServ.com`},
            // { type: 'PLAYING', name: 'Server by mTxServ.com' },
        ])

        this.mainGuilds = [
            '529605510219956233',
            '726178170314817630',
           // '539501579137581071'
        ]

        this.setProvider(new FirebaseProvider()).catch(console.error)
    }

    isMainGuild(guildId) {
        return -1 !== this.mainGuilds.indexOf(guildId)
    }
};
