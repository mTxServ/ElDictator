const mTxServCommand = require('../mTxServCommand.js')
const Discord = require('discord.js')

module.exports = class RankCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'rank',
            aliases: ['point', 'level'],
            group: 'mtxserv',
            memberName: 'rank',
            description: 'Show my rank',
            clientPermissions: ['SEND_MESSAGES'],
            guarded: true,
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    run(msg) {
        const lang = require(`../../languages/${this.resolveLangOfMessage(msg)}.json`)

        const scores = this.client.ranker.getScoresOfUser(msg.guild.id, msg.author, true)

        const embed = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag, msg.author.avatarURL())
            .setThumbnail(msg.author.avatarURL())
            .setColor('#A4F2DF')
        ;

        let allMembersArray = [];
        let rank = 0;

        const scoresOfAllMembers = this.client.ranker.getScoresOfGuild(msg.guild.id);
        for (const key in scoresOfAllMembers) {
            const settings = {
                userId: key,
                points: scoresOfAllMembers[key].points
            };
            if (settings.userId !== 'global') {
                allMembersArray.push(settings);
            }
        }

        for (let i = 0; i < allMembersArray.length; i += 1) {
            if (allMembersArray[i].userId === msg.author.id) {
                rank = i + 1;
            }
        }

        allMembersArray = allMembersArray.sort((a, b) => {
            if (a.points < b.points) {
                return 1;
            }
            if (a.points > b.points) {
                return -1;
            }
            return 0;
        });

        embed.addField('Points', scores.points, true);
        embed.addField('Level', scores.level, true);
        embed.addField('Rank', `${rank}/${allMembersArray.length}`);

        return msg.say({
            embed
        });
    }
};