const mTxServCommand = require('../mTxServCommand.js')
const Discord = require('discord.js')
const paginationEmbed = require('discord.js-pagination');

module.exports = class RanksCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'ranks',
            aliases: ['levels', 'top'],
            group: 'mtxserv',
            memberName: 'ranks',
            description: 'Show top ranking',
            clientPermissions: ['SEND_MESSAGES'],
            guarded: true,
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg) {
        const topMembers = Object.values(await this.client.ranker.getScoresOfGuild(msg.guild.id))
            .sort((a, b) => (a.points < b.points) ? 1 : -1 )
            .slice(0, 10)

        const pages = []
        let i = 1

        for (const userScores of topMembers) {
            const embed = new Discord.MessageEmbed()
                .setColor('#A4F2DF')
            ;
            const user = await this.client.users.cache.get(userScores.userId)
            if (user) {
                embed
                    .setAuthor(`#${i}. ${user.username}`, user.avatarURL())
                    .setThumbnail(user.avatarURL())

            } else {
                embed.setTitle(`#${i}. ${userScores.username}`)
            }

            embed.addField('Points', userScores.points, true);
            embed.addField('Level', userScores.level, true);
            embed.addField('Rank', i);

            i++
            pages.push(embed)
        }

        if (pages.length === 1) {
            const embed = pages[0]
            return msg.say({
                embed
            })
        }

        paginationEmbed(msg, pages);
    }
};