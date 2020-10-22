const mTxServCommand = require('../mTxServCommand.js');
const CarlGGApi = require('../../api/CarlGGApi')

module.exports = class SyncRankCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'sync-ranks',
            aliases: ['sync-rank'],
            group: 'admin',
            memberName: 'sync-ranks',
            description: 'Sync ranks with carl.gg',
            clientPermissions: ['SEND_MESSAGES'],
            ownerOnly: true,
            guildOnly: true,
            hidden: true,
            guarded: true
        });
    }

    async run(msg) {
        const api = new CarlGGApi()

        let page = 0
        let players = []

        this.client.ranker.resetScoresOfGuild(msg.guild.id)

        do {
            console.log(`fetch page ${page}`)
            players = await api.getPlayersPage(page)

            for (const player of players) {
                const user = await this.client.users.cache.get(player.id)
                if (!user) {
                    continue
                }

                const level = Math.floor(0.3 * Math.sqrt(player.message_count));
                const scores = {
                    points: player.message_count,
                    username: player.username,
                    userId: player.id,
                    level: level,
                    lastMessage: new Date().getTime()
                }

                this.client.ranker.setScoresOfUser(msg.guild.id, player.id, scores)
            }

            page++

            if (page > 10) {
                break;
            }
        } while(Object.values(players).length > 0)

        return this.saySuccess(msg, 'Ranks synchronized with carl.gg')
    }
};