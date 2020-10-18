const LANGUAGE = `g_lang_%id%`
const GAME_SERVER_LIST = `g_gs_list_%id%`
const FEED_SUB_CHANNELS = `feed_sub_%tag%`

module.exports = class GuildSetting {
    language(guidId) {
        return client.settings.get(LANGUAGE.replace('%id%', guidId), process.env.DEFAULT_LANG)
    }

    setLanguage(guildId, language) {
        client.settings.set(LANGUAGE.replace('%id%', guildId), language)
    }

    gameServers(guidId) {
        return client.settings.get(GAME_SERVER_LIST.replace('%id%', guidId), [])
    }

    addGameServer(guidId, gameServer) {
        const gameServers = this.gameServers(guidId)
            .filter(gs => gs.address !== gameServer.address)

        gameServers.push(gameServer)
        
        client.settings.set(GAME_SERVER_LIST.replace('%id%', guidId), gameServers)
    }

    clearGameServers(guidId) {
        client.settings.set(GAME_SERVER_LIST.replace('%id%', guidId), [])
    }

    susbribedServersOfTag(tagName) {
        return client.settings.get(FEED_SUB_CHANNELS.replace('%tag%', tagName), [])
    }

    subscribeToTag(guidId, tagName) {
        const servers = this.susbribedServersOfTag(tagName)
            .filter(server => server.guildId !== guidId)

        servers.push(guidId)

        client.settings.set(FEED_SUB_CHANNELS.replace('%id%', guidId), servers)
    }

    hasSubscribeToTag(guidId, tagName) {
        return this.susbribedServersOfTag(tagName)
            .filter(server => server === guidId)
            .length > 0
    }
};