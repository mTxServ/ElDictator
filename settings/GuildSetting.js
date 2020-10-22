const LANGUAGE = `g_lang_%id%`
const GAME_SERVER_LIST = `g_gs_list_%id%`
const FEED_SUB_CHANNELS = `feed_sub_%tag%`
const RANK_SCORES = `g_scores_%id%`

module.exports = class GuildSetting {
    language(guidId) {
        return client.settings.get(LANGUAGE.replace('%id%', guidId), process.env.DEFAULT_LANG)
    }

    setLanguage(guildId, language) {
        client.settings.set(LANGUAGE.replace('%id%', guildId), language)
    }

    gameServers(guildId) {
        return client.settings.get(GAME_SERVER_LIST.replace('%id%', guildId), [])
    }

    addGameServer(guildId, gameServer) {
        const gameServers = this.gameServers(guildId)
            .filter(gs => gs.address !== gameServer.address)

        gameServers.push(gameServer)
        
        client.settings.set(GAME_SERVER_LIST.replace('%id%', guildId), gameServers)
    }

    clearGameServers(guildId) {
        client.settings.set(GAME_SERVER_LIST.replace('%id%', guildId), [])
    }

    susbribedServersOfTag(tagName) {
        return client.settings.get(FEED_SUB_CHANNELS.replace('%tag%', tagName), [])
    }

    subscribeToTag(guildId, tagName, channelId, locale) {
        const servers = this.susbribedServersOfTag(tagName)
            .filter(server => server.guildId !== guildId)

        servers.push({
            guildId: guildId,
            channelId: channelId,
            locale: locale
        })

        client.settings.set(FEED_SUB_CHANNELS.replace('%tag%', tagName), servers)
    }

    unsubscribeToTag(guildId, tagName) {
        const servers = this.susbribedServersOfTag(tagName)
            .filter(server => server.guildId !== guildId)

        client.settings.set(FEED_SUB_CHANNELS.replace('%tag%', tagName), servers)
    }

    hasSubscribeToTag(guildId, tagName) {
        return this.susbribedServersOfTag(tagName)
            .filter(server => server.guildId === guildId)
            .length > 0
    }

    getSubscribeToTag(guildId, tagName) {
        return this.susbribedServersOfTag(tagName)
            .filter(server => server.guildId === guildId)
    }

    getScoresOfGuild(guidId) {
        return JSON.parse(client.settings.get(RANK_SCORES.replace('%id%', guidId), '{}'))
    }

    setScoresOfGuild(guidId, scores) {
        client.settings.set(RANK_SCORES.replace('%id%', guidId), JSON.stringify(scores))
    }
};