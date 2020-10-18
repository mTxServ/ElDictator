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
        const links = [];
        let oldArticles = client.settings.get('feed_articles', [])

        for (const feed of this.feeds) {
            const results = await this.rssFeeder.get(feed.url)
            const articles = Object.values(results.items)

            for (const article of articles) {
                links.push(article.link)

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

                for (const tagName of feed.tags) {
                    const servers = client.guildSettings.susbribedServersOfTag(tagName)
                    for (const channelId of feed.channels) {
                        if (!client.channels.cache.has(channelId)) {
                            console.error(`Channel ${channelId} not found`)
                            continue
                        }

                        const channel = client.channels.cache.get(channelId);
                        channel.send({
                            embed: embed
                        })
                    }

                    for (const server of servers) {
                        if (server.locale !== 'all' && -1 === feed.languages.indexOf(server.locale)) {
                            continue
                        }

                        if (!client.channels.cache.has(server.channelId)) {
                            console.error(`Channel ${server.channelId} not found`)
                            continue
                        }

                        const channel = client.channels.cache.get(server.channelId);
                        channel.send({
                            embed: embed
                        })
                    }
                }
            }
        }

        client.settings.set('feed_articles', links)
    }
}

module.exports = FeedMonitor;
