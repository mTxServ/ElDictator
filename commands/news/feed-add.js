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
                    key: 'tag',
                    prompt: 'Which game do you want to follow?',
                    type: 'string',
                    oneOf: ['minecraft', 'ark', 'rust', 'gmod', 'sandbox', 'hytale', 'fivem', 'csgo', 'valorant', 'lol', 'overwatch', 'fortnite', 'rocketleague', 'fifa21', 'cod', 'onset'],
                },
                {
                    key: 'channelId',
                    prompt: 'In which channel ID post new articles?',
                    type: 'string',
                    validate: text => text.length >= 10,
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

    async run(msg, {tag, channelId, locale}) {
        const userLang = this.resolveLangOfMessage(msg)
        const lang = require(`../../languages/${userLang}.json`)

        const isAllowed = msg.member.hasPermission('ADMINISTRATOR')
        if (!isAllowed) {
            return this.sayError(msg, lang['server_add']['permissions'])
        }

        if (!this.client.channels.cache.has(channelId)) {
            return this.sayError(msg, 'No channel found with this ID')
        }

        const channel = this.client.channels.cache.get(channelId)
        this.client.guildSettings.subscribeToTag(msg.guild.id, tag, channelId, locale)

        return this.saySuccess(msg, `New articles about **${tag.toUpperCase()}** in **${locale === 'all' ? 'all languages' : locale.toUpperCase()}** will be post in channel **${channel.name}**.`)
    }
};