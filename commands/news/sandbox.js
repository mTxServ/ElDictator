const mTxServCommand = require('../mTxServCommand.js');
const RssFeederApi = require('../../api/RssFeederApi')
const Discord = require('discord.js');
const striptags = require('striptags')

module.exports = class NewsMinecraftFrCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'sandbox',
            aliases: ['s&box', 'gmod2'],
            group: 'news',
            memberName: 'sandbox',
            description: 'Show latest blog posts from sandbox.facepunch.com',
            clientPermissions: ['SEND_MESSAGES'],
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg) {
        const api = new RssFeederApi();
        const feed = await api.get('https://sandbox.facepunch.com/rss/news');
        const articles = Object.values(feed.items)

        const embed = new Discord.MessageEmbed()
            .setDescription(`${feed.description}\n<${feed.link}>`)
            .setColor('BLUE')
            .setTimestamp()
            .setAuthor(feed.title, `https://mtxserv.com/build/manager-game/img/game/minecraft.png`)
        ;

        for (const k in articles.slice(0, 3)) {
            let content = articles[k]['contentSnippet'] || articles[k]['content']
            content = striptags(content).replace(/(?:https?|ftp):\/\/[\n\S]+/g, '').trim();
            content = content.length > 200 ? content.substr(0, 200) : content

            embed.addField(`__:writing_hand: ${articles[k].title}__`, `${content}\n:link: <${articles[k].link}>`)
        }

        return msg.say({
            embed
        });
    }
};
