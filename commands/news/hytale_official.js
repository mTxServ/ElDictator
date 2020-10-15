const mTxServCommand = require('../mTxServCommand.js');
const HytaleOfficialApi = require('../../api/HytaleOfficialApi')
const Discord = require('discord.js');

module.exports = class NewsHytaleOfficialCommand extends mTxServCommand {
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
        const api = new HytaleOfficialApi();
        const articles = await api.latest();

        const embed = new Discord.MessageEmbed()
            .setColor('BLUE')
            .setTimestamp()
            .setAuthor('Hytale Official', 'https://hytale.com/favicon.ico', 'https://hytale.com')
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