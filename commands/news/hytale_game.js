const mTxServCommand = require('../mTxServCommand.js');
const RssFeederApi = require('../../api/RssFeederApi')
const Discord = require('discord.js');
const striptags = require('striptags')

module.exports = class NewsHytaleGameCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'hytalefr',
            aliases: ['hytale-fr', 'hytale-game'],
            group: 'news',
            memberName: 'hytalefr',
            description: 'Show latest blog posts from Hytale.game (FR)',
            clientPermissions: ['SEND_MESSAGES'],
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg) {
        const api = new RssFeederApi();
        const feed = await api.get('https://hytale.game/p/index.rss');
        const articles = Object.values(feed.items)

        const embed = new Discord.MessageEmbed()
            .setDescription(`${feed.description}`)
            .setColor('BLUE')
            .setTimestamp()
            .setAuthor(feed.title, 'https://hytale.com/favicon.ico', 'https://hytale.game')
        ;

        for (const k in articles.slice(0, 3)) {
            let content = articles[k]['content'] || articles[k]['content:encodedSnippet']
            content = striptags(content).replace(/(?:https?|ftp):\/\/[\n\S]+/g, '').trim();
            content = content.length > 200 ? content.substr(0, 200) : content

            embed.addField(`__:writing_hand: ${articles[k].title}__`, `${content}\n:link: <${articles[k].link}>`)
        }

        return msg.say({
            embed
        });
    }
};