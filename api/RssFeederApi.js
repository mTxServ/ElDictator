const Discord = require('discord.js')
const Parser = require('rss-parser');

class RssFeederApi {
    async get(feedUrl) {
        let parser = new Parser();
        return await parser.parseURL(feedUrl);
    }
}

module.exports = RssFeederApi;
