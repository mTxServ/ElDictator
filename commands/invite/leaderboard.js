const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js');

module.exports = class StockCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'invite-ranks',
            aliases: ['invite-rank', 'invite-ranking', 'invites', 'invite', 'i'],
            group: 'mtxserv',
            memberName: 'invite-ranks',
            description: 'Show invitation leaderboard of current guild',
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
        return;
        
        const userLang = await this.resolveLangOfMessage(msg)
        const lang = require(`../../languages/${userLang}.json`)

        const embed = new Discord.MessageEmbed()
            .setAuthor(`Leaderboard Invitations`, client.user.displayAvatarURL(), `${userLang === 'fr' ? 'https://mtxserv.com/fr/' : 'https://mtxserv.com/'}`)
            .setColor('BLUE')
        ;

        let description = `${lang['invite_ranking']['description']}\n`

        let topMembers = await this.client.inviteManager.getScores(msg.guild)
            .sort((a, b) => (a.totalCount < b.totalCount) ? 1 : -1 )
            .slice(0, 30)
        
        if (topMembers !== null) {
            topMembers = Object.values(topMembers)
                .sort((a, b) => (a.totalCount < b.totalCount) ? 1 : -1 )
                .slice(0, 30)
        }
        
        if (!topMembers || !topMembers.length) {
            description += `\n${lang['invite_ranking']['empty']}`
        } else {
            description += `\n${lang['invite_ranking']['headers']}`
        }

        topMembers.map(score => {
            description += `\`\`\`${score.totalCount || (score.inviteCount - score.leaveCount)}        ${score.inviteCount}        ${score.leaveCount}        ${score.userName}\`\`\``
        })

        embed.setDescription(description)

        return msg.say({
            embed
        })
    }
};
