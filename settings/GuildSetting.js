const LANGUAGE = `g_lang_%id%`
const GAME_SERVER_LIST = `g_gs_list_%id%`

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
        const gameServers = client.settings
            .get(GAME_SERVER_LIST.replace('%id%', guidId), [])
            .filter(gs => gs.address !== gameServer.address)

        gameServers.push(gameServer)
        
        client.settings.set(GAME_SERVER_LIST.replace('%id%', guidId), gameServers)
    }

    clearGameServers(guidId) {
        client.settings.set(GAME_SERVER_LIST.replace('%id%', guidId), [])
    }
};