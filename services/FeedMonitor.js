const RssFeederApi = require('../api/RssFeederApi')
const striptags = require('striptags')
const Discord = require('discord.js')
const Grabity = require("grabity");

class FeedMonitor {
    constructor(feeds) {
        this.feeds = feeds
        this.rssFeeder = new RssFeederApi()
    }

    async warmup() {
        const links = [];

        for (const feed of this.feeds) {
            const results = await this.rssFeeder.get(feed.url)
            const articles = Object.values(results.items)

            for (const article of articles) {
                links.push(article.link)
            }
        }

        client.settings.set('feed_articles', links)
    }

    async process() {
        console.log('Check feeds')

        let oldArticles = client.settings.get('feed_articles', [])
        for (const feed of this.feeds) {
            const results = await this.rssFeeder.get(feed.url)
            const articles = Object.values(results.items)

            for (const article of articles) {
                if (-1 !== oldArticles.indexOf(article.link)) {
                    continue
                }
                const embed = new Discord.MessageEmbed()
                    .setAuthor(results.title, feed.icon, article.link)
                    .setTitle(`:newspaper: ${article.title}`)
                    .setColor('BLUE')
                    .setTimestamp()
                ;

                let it = await Grabity.grabIt(article.link)
                let content = ''

                if (it.content || it.description) {
                    content = it.content || it.description
                    if (it.image) {
                        embed.setImage(it.image)
                    }
                } else {
                    content = article['contentSnippet'] || article['content'] || article['content:encodedSnippet']
                }

                content = striptags(content).replace(/(?:https?|ftp):\/\/[\n\S]+/g, '').trim();
                content = content.length > 300 ? content.substr(0, 300) : content

                embed.setDescription(`${content}\n${article.link}`)

                for (const channelId of feed.channels) {
                    const channel = client.channels.cache.get(channelId);
                    if (!channel) {
                        throw new Error(`Channel ${channelId} not found`)
                    }

                    channel.send({
                        embed: embed
                    })
                }
            }
        }
    }
}

module.exports = FeedMonitor;
