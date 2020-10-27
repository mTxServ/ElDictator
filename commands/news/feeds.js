const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js');
const FeedMonitor = require('../../services/FeedMonitor');

module.exports = class FeedCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'feeds',
            aliases: ['feed', 'news'],
            group: 'news',
            memberName: 'feeds',
            description: 'Display feeds list.',
            guarded: true,
            guildOnly: true,
        });
    }

    async run(msg) {
        const lang = require(`../../languages/${await this.resolveLangOfMessage(msg)}.json`)

        const games = [
            {
                name: 'Minecraft',
                key: 'minecraft'
            },
            {
                name: 'Hytale',
                key: 'hytale'
            },
            {
                name: 'GMod',
                key: 'gmod'
            },
            {
                name: 'Rust',
                key: 'rust'
            },
            {
                name: 'ARK',
                key: 'ark'
            },
            {
                name: 'FiveM',
                key: 'fivem'
            },
            {
                name: 'CS:GO',
                key: 'csgo'
            },
            {
                name: 'Valorant',
                key: 'valorant'
            },
            {
                name: 'League of Legends',
                key: 'lol'
            },
            {
                name: 'Overwatch',
                key: 'overwatch'
            },
            {
                name: 'Fortnite',
                key: 'fortnite'
            },
            {
                name: 'Rocket League',
                key: 'rocketleague'
            },
            {
                name: 'S&Box',
                key: 'sandbox'
            },
        ]

        const embed = new Discord.MessageEmbed()
            .setAuthor(lang['feeds']['title'])
            .setColor('BLUE')
            .setDescription(lang['feeds']['description'])
        ;


        for (const game of games) {
            const followFR = await FeedMonitor.isFollowing(msg.guild.id, game.key, 'fr', false)
            const followEN = await FeedMonitor.isFollowing(msg.guild.id, game.key, 'en', false)
            const followAll = await FeedMonitor.isFollowing(msg.guild.id, game.key, 'all', false)

            let description = ''

            if (!followFR && !followEN && !followAll) {
                description = `*${lang['feeds']['unfollow']}*`
            } else {
                if (followAll) {
                    description = description + `:flag_us: :flag_fr: <#${followAll}>`
                }

                if(followFR) {
                    description = description + `${followAll ? '\n' : ''}:flag_fr: <#${followFR}>`
                }

                if(followEN) {
                    description = description + `${followAll || followFR ? '\n' : ''}:flag_us: <#${followEN}>`
                }
            }

            embed.addField(`❯ ${game.name}`, description, true)
        }

        return msg.say({
            embed
        });
    }
};