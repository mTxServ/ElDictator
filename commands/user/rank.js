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

        const userScores = this.client.ranker.getScoresOfUser(msg.guild.id, msg.author, true)

        const embed = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag, msg.author.avatarURL())
            .setThumbnail(msg.author.avatarURL())
            .setColor('#A4F2DF')
        ;

        const allMembers = Object.values(this.client.ranker.getScoresOfGuild(msg.guild.id))

        const filteredMembers = Object.values(this.client.ranker.getScoresOfGuild(msg.guild.id))
            .filter(scores => scores.points >= userScores.points)

        embed.addField('Points', userScores.points, true);
        embed.addField('Level', userScores.level, true);
        embed.addField('Rank', `${filteredMembers.length}/${allMembers.length}`);

        return msg.say({
            embed
        });
    }
};