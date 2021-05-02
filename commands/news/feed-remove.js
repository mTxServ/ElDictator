const mTxServCommand = require('../mTxServCommand.js')

module.exports = class FeedAddCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'feed-remove',
            aliases: ['remove-feed', 'delete-feed', 'feed-delete'],
            group: 'news',
            memberName: 'feed-remove',
            description: 'Unsubscribe to a feed',
            userPermissions: ['ADMINISTRATOR'],
            clientPermissions: ['SEND_MESSAGES'],
            guarded: true,
            guildOnly: true,
            args: [
                {
                    key: 'game',
                    prompt: 'Which game do you want to follow?',
                    type: 'string',
                    oneOf: ['minecraft', 'ark', 'rust', 'gmod', 'sandbox', 'hytale', 'csgo', 'valorant', 'lol', 'overwatch', 'fortnite', 'rocketleague', 'fifa21', 'cod', 'onset', 'web', 'film', 'science'],
                },
            ],
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg, {game}) {
        const userLang = await this.resolveLangOfMessage(msg)
        const lang = require(`../../languages/${userLang}.json`)

        const isAllowed = msg.member.hasPermission('ADMINISTRATOR')
        if (!isAllowed) {
            return this.sayError(msg, lang['server_add']['permissions'])
        }

        await this.client.provider.rootRef
            .child(msg.guild.id)
            .child('feeds_suscribed')
            .child(game)
            .remove()

        return this.saySuccess(msg, `Game **${game.toUpperCase()}** unfollowed.`)
    }
};
