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
                    key: 'tag',
                    prompt: 'Which game do you want to follow?',
                    type: 'string',
                    oneOf: ['minecraft', 'ark', 'rust', 'gmod', 'sandbox', 'hytale', 'fivem', 'csgo', 'valorant', 'lol', 'overwatch', 'fortnite', 'rocketleague', 'fifa21', 'cod', 'onset'],
                },
            ],
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg, {tag, channelId}) {
        const userLang = await this.resolveLangOfMessage(msg)
        const lang = require(`../../languages/${userLang}.json`)

        const isAllowed = msg.member.hasPermission('ADMINISTRATOR')
        if (!isAllowed) {
            return this.sayError(msg, lang['server_add']['permissions'])
        }

        this.client.guildSettings.unsubscribeToTag(msg.guild.id, tag, channelId)

        return this.saySuccess(msg, `Game **${tag.toUpperCase()}** unfollowed.`)
    }
};