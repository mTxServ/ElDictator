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
		let oldArticles = await client.settings.get(this.getCacheKey(), [])

		for (const feed of this.feeds) {
			const results = await this.rssFeeder.get(feed.url)
			const articles = Object.values(results.items)

			for (const article of articles) {
				if (oldArticles.indexOf(article.link) !== -1) {
					continue
				}

				oldArticles.push(article.link)

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
					const followAll       = await FeedMonitor.isFollowing(guild.id, primaryTag, 'all', false)
					const followLocalized = await FeedMonitor.isFollowing(guild.id, primaryTag, feed.language, false)

					// send to specified channels configured in feeds.json
					for (const channelId of feed.channels) {
						FeedMonitor.sendArticle(guild.id, channelId, embed)
					}

					// send to specified guild channel (user conf)
					if (followAll) {
						FeedMonitor.sendArticle(guild.id, followAll, embed)
					}

					if (followLocalized) {
						FeedMonitor.sendArticle(guild.id, followLocalized, embed)
					}
				}
			}
		}

		FeedMonitor.sendErrorMessage(`We have finiched all articles and are updating the database`)
		client.settings.set(this.getCacheKey(), oldArticles)
	}

	static sendArticle(guildId, channel, article)
	{
		if (!client.channels.cache.has(channel)) {
			console.error(`Channel ${channel} not found`)
			return
		}
		
		try
		{
			client.channels.cache.get(channel).send({ embed: article })
		} 
		catch(error)
		{
			console.log(`Bot on server ${guildId} can't send message in channel ${channel}`)
			FeedMonitor.sendErrorMessage(`Bot on server ${guildId} can't send message in channel ${channel}`)
		}
	}

	static sendErrorMessage(message)
	{
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
						description: message
					}
				})
			;
		}
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
