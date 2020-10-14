const mTxServCommand = require('../mTxServCommand.js');
const HytaleOfficialApi = require('../../api/HytaleOfficialApi')
const Discord = require('discord.js');

module.exports = class SupportCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'hytale',
            aliases: ['hytale-en', 'hytale-news', 'news-hytale'],
            group: 'news',
            memberName: 'hytale-official',
            description: 'Show latest blog posts from Hytale official website',
            clientPermissions: ['SEND_MESSAGES'],
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg) {
        const userLang = this.resolveLangOfMessage(msg)
        const lang = require(`../../languages/${userLang}.json`)

        const api = new HytaleOfficialApi();
        const articles = await api.latest();

        const embed = new Discord.MessageEmbed()
            .setTitle(lang['news']['title'].replace('%about%', 'Hytale'))
            .setColor('BLUE')
            .setTimestamp()
        ;

        for (const k in articles.slice(0, 3)) {
            const publishAt = new Date(articles[k].publishedAt);
            embed.addField(`__:writing_hand: ${articles[k].title}__`, `${articles[k].bodyExcerpt}\n:link: <https://hytale.com/news/${publishAt.getFullYear()}/${publishAt.getMonth() + 1}/${articles[k].slug}>`)
        }

        return msg.say({
            embed
        });
    }
};