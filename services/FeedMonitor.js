const RssFeederApi = require('../api/RssFeederApi')
const striptags = require('striptags')
const Discord = require('discord.js')
const Grabity = require("grabity");

class FeedMonitor {
    constructor(feeds) {
        this.feeds = feeds
        this.rssFeeder = new RssFeederApi()
    }

    getCacheKey() {
        return isDev ? 'feeds_cache_dev' : 'feeds_cache'
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

        await client.settings.set(this.getCacheKey(), links)
    }

    async process() {
        const links = [];

        let oldArticles = await client.settings.get(this.getCacheKey(), [])

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

                const primaryTag = feed.tags[0]

                for (const guild of client.guilds.cache.array()) {
                    const followAll = await FeedMonitor.isFollowing(guild.id, primaryTag, 'all', false)
                    const followLocalized = await FeedMonitor.isFollowing(guild.id, primaryTag, feed.language, false)
                    
                     if (!guild.me.hasPermission("SEND_MESSAGES")) {
                            console.error(`Bot on server ${guild.id} has not send messages permission`)
                            continue
                     }

                    // send to specified channels configured in feeds.json
                    for (const channelId of feed.channels) {
                        if (!client.channels.cache.has(channelId)) {
                            console.error(`Channel ${channelId} not found`)
                            continue
                        }
                        
                        if( !guild.me.permissionsIn(channelId).has("SEND_MESSAGES") )
                        {
                            console.error(`Bot on server ${guild.id} has not send messages permission in channel {channelId}`)
                            
                            if (client.channels.cache.has(process.env.LOG_CHANNEL_ID)) {
                                client
                                    .channels
                                    .cache
                                    .get(process.env.LOG_CHANNEL_ID)
                                    .send(null, {
                                        embed: {
                                            color: 15684432,
                                            timestamp: new Date(),
                                            title: 'Error',
                                            description: `Bot on server ${guild.id} has not send messages permission in channel {channelId}`
                                        }
                                    })
                                ;
                            }
                            continue
                        }
                        
                        const channel = client.channels.cache.get(channelId);
                        channel.send({
                            embed: embed
                        })
                    }

                    // send to specified guild channel (user conf)
                    if (followAll) {
                        if (!client.channels.cache.has(followAll)) {
                            console.error(`Channel ${followAll} not found`)
                            continue
                        }
                        
                        if( !guild.me.permissionsIn(followAll).has("SEND_MESSAGES") )
                        {
                            console.error(`Bot on server ${guild.id} has not send messages permission in channel {followAll}`)
                            
                            if (client.channels.cache.has(process.env.LOG_CHANNEL_ID)) {
                                client
                                    .channels
                                    .cache
                                    .get(process.env.LOG_CHANNEL_ID)
                                    .send(null, {
                                        embed: {
                                            color: 15684432,
                                            timestamp: new Date(),
                                            title: 'Error',
                                            description: `Bot on server ${guild.id} has not send messages permission in channel {followAll}`
                                        }
                                    })
                                ;
                            }
                            continue
                        }

                        client.channels.cache.get(followAll).send({
                            embed: embed
                        })
                    }

                    if (followLocalized) {
                        if (!client.channels.cache.has(followLocalized)) {
                            console.error(`Channel ${followLocalized} not found`)
                            continue
                        }
                        
                        if( !guild.me.permissionsIn(followLocalized).has("SEND_MESSAGES") )
                        {
                            console.error(`Bot on server ${guild.id} has not send messages permission in channel {followLocalized}`)
                            
                            if (client.channels.cache.has(process.env.LOG_CHANNEL_ID)) {
                                client
                                    .channels
                                    .cache
                                    .get(process.env.LOG_CHANNEL_ID)
                                    .send(null, {
                                        embed: {
                                            color: 15684432,
                                            timestamp: new Date(),
                                            title: 'Error',
                                            description: `Bot on server ${guild.id} has not send messages permission in channel {followLocalized}`
                                        }
                                    })
                                ;
                            }
                            continue
                        }

                        client.channels.cache.get(followLocalized).send({
                            embed: embed
                        })
                    }
                }
            }
        }

        client.settings.set(this.getCacheKey(), links)
    }

    static async isFollowing(guildId, game, language, defaultValue) {
        const snapshot = await client.provider.rootRef
            .child(guildId)
            .child('feeds_suscribed')
            .child(game)
            .child(language)
            .once("value")

        const value = snapshot.val()

        return value == null ? defaultValue : value;
    }
}

module.exports = FeedMonitor;
