const mTxServCommand = require('../mTxServCommand.js')
const mTxServApi = require('../../api/mTxServApi')
const GameServerApi = require('../../api/GameServerApi')
const Discord = require('discord.js')

module.exports = class GameServerAddCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'feed-add',
            aliases: ['add-feed'],
            group: 'news',
            memberName: 'feed-add',
            description: 'Subscribe to a feed',
            userPermissions: ['ADMINISTRATOR'],
            clientPermissions: ['SEND_MESSAGES'],
            guarded: true,
            guildOnly: true,
            args: [
                {
                    key: 'game',
                    prompt: 'Which game do you want to follow?',
                    type: 'string',
                    oneOf: ['minecraft', 'ark', 'rust', 'gmod', 'sandbox', 'hytale', 'fivem', 'csgo', 'valorant', 'lol', 'overwatch', 'fortnite', 'rocketleague'],
                },
                {
                    key: 'channel',
                    prompt: 'In which channel do you want to post new articles?',
                    type: 'channel',
                },
                {
                    key: 'locale',
                    prompt: 'Which language?',
                    type: 'string',
                    default: 'all',
                    oneOf: ['fr', 'en', 'all'],
                },
            ],
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg, {game, channel, locale}) {
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
            .child(locale)
            .set(channel.id)

        return this.saySuccess(msg, `New articles about **${game.toUpperCase()}** in **${locale === 'all' ? 'all languages' : locale.toUpperCase()}** will be post in channel **${channel.name}**.`)
    }
};