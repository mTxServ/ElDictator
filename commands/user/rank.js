const mTxServCommand = require('../mTxServCommand.js')
const Discord = require('discord.js')
const { getUserFromMention } = require('../../util/Util')
const mTxServApi = require('../../api/mTxServApi')

module.exports = class RankCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'rank',
            aliases: ['point', 'level', 'profile'],
            group: 'mtxserv',
            memberName: 'rank',
            description: 'Show my rank',
            clientPermissions: ['SEND_MESSAGES'],
            guarded: true,
            guildOnly: true,
            args: [
                {
                    key: 'user',
                    prompt: 'Which user ?',
                    type: 'string',
                    default: '',
                    validate: text => {
                        return getUserFromMention(text);
                    }
                },
            ],
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg, {user}) {
        const lang = require(`../../languages/${this.resolveLangOfMessage(msg)}.json`)
        const input = user

        if (user.length) {
            user = getUserFromMention(user)
            if (!user) {
                return this.sayError(msg, 'User not found');
            }
        }

        user = user ? user : msg.author

        const userScores = this.client.ranker.getScoresOfUser(msg.guild.id, user, true)
        const embed = new Discord.MessageEmbed()
            .setThumbnail(user.avatarURL())
            .setColor('#A4F2DF')
        ;

        // me
        const api = new mTxServApi()
        let isAuthenticated = api.isAuthenticated(user.id)
        let profile = {
            about: false,
            is_admin: false,
            discord_url: null,
            facebook_url: null,
            twitter_url: null,
            youtube_url: null,
            instagram_url: null,
            twitch_url: null,
            website_url: null,
            workshop_url: null,
            tutorial_add_link: null,
            tutorials: [],
        }

        if (isAuthenticated) {
            try {
                const oauth = await api.loginFromCredentials(user.id)
                profile = await api.call(oauth['access_token'], 'user/me')
                isAuthenticated = true
            } catch(err) {
                isAuthenticated = false
                console.error(err)
            }
        }

        // scores
        const allMembers = Object.values(this.client.ranker.getScoresOfGuild(msg.guild.id))

        const filteredMembers = Object.values(this.client.ranker.getScoresOfGuild(msg.guild.id))
            .filter(scores => scores.points >= userScores.points)

        // embed
        embed.setAuthor(`${user.username} profile`, null, profile.website_url)
        embed.addField(':star: Points', userScores.points, true);
        embed.addField(':chart_with_upwards_trend: Level', userScores.level, true);
        embed.addField(':medal: Rank', `${filteredMembers.length}`, true);
        embed.addField(':paperclips: Linked', isAuthenticated ? '✓':'✗', true);

        let description = profile.about || ''

        if (profile.tutorials && profile.tutorials.length) {
            description += `\n\n**Latest tutos by ${user.username}** ([how to write a tuto?](${profile.tutorial_add_link}))`
        }

        for (const tutorial of profile.tutorials) {
            description += `\n✓ [${tutorial.title}](${tutorial.link})`
        }

        description = profile.about ? description : description + "\n\n[Edit my profile](https://mtxserv.com/fr/mon-compte)"

        embed.setDescription(description)

        if (profile.is_admin) {
            embed.setFooter(`💫 ${user.username} is admin`)
        }

        if (profile.website_url) {
            embed.addField(`Website`, `[Visit website](${profile.website_url})`, true)
        }

        if (profile.workshop_url) {
            embed.addField(`Workshop`, `[STEAM Workshop](${profile.workshop_url})`, true)
        }

        if (profile.discord_url) {
            embed.addField(`Discord`, `[Join server](${profile.discord_url})`, true)
        }

        if (profile.twitter_url) {
            embed.addField(`Twitter`, `[Twitter](${profile.twitter_url})`, true)
        }

        if (profile.youtube_url) {
            embed.addField(`Youtube`, `[Youtube](${profile.youtube_url})`, true)
        }

        if (profile.twitch_url) {
            embed.addField(`Twitch`, `[Twitch](${profile.twitch_url})`, true)
        }

        if (profile.facebook_url) {
            embed.addField(`Facebook`, `[Facebook](${profile.facebook_url})`, true)
        }

        return msg.say({
            embed
        });
    }
};