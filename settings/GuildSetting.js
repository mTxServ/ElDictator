const LANGUAGE = `g_lang_%id%`
const GAME_SERVER_LIST = `g_gs_list_%id%`
const FEED_SUB_CHANNELS = `feed_sub_%tag%`
const RANK_SCORES = `g_scores_%id%`
const USER_BADGES = `u_badges_%id%_%userid%`

module.exports = class GuildSetting {
    gameServers(guildId) {
        return client.provider.sqlite.get(null, GAME_SERVER_LIST.replace('%id%', guildId), [])
    }

    addGameServer(guildId, gameServer) {
        const gameServers = this.gameServers(guildId)
            .filter(gs => gs.address !== gameServer.address)

        gameServers.push(gameServer)

        client.provider.sqlite.set(null, GAME_SERVER_LIST.replace('%id%', guildId), gameServers)
    }

    clearGameServers(guildId) {
        client.provider.sqlite.set(null, GAME_SERVER_LIST.replace('%id%', guildId), [])
    }

    susbribedServersOfTag(tagName) {
        return client.provider.sqlite.get(null, FEED_SUB_CHANNELS.replace('%tag%', tagName), [])
    }

    subscribeToTag(guildId, tagName, channelId, locale) {
        const servers = this.susbribedServersOfTag(tagName)
            .filter(server => server.guildId !== guildId)

        servers.push({
            guildId: guildId,
            channelId: channelId,
            locale: locale
        })

        client.provider.sqlite.set(null, FEED_SUB_CHANNELS.replace('%tag%', tagName), servers)
    }

    unsubscribeToTag(guildId, tagName) {
        const servers = this.susbribedServersOfTag(tagName)
            .filter(server => server.guildId !== guildId)

        client.provider.sqlite.set(null, FEED_SUB_CHANNELS.replace('%tag%', tagName), servers)
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
        return JSON.parse(client.provider.sqlite.get(null, RANK_SCORES.replace('%id%', guidId), '{}'))
    }

    setScoresOfGuild(guidId, scores) {
        client.provider.sqlite.set(null, RANK_SCORES.replace('%id%', guidId), JSON.stringify(scores))
    }

    getBadgesOfUser(guidId, userId) {
        return client.provider.sqlite.get(null, USER_BADGES.replace('%id%', guidId).replace('%userid%', userId), [])
    }

    setBadgesOfUser(guidId, userId, badges) {
        client.provider.sqlite.set(null, USER_BADGES.replace('%id%', guidId).replace('%userid%', userId), badges)
    }
};