const GAME_SERVER_LIST = `g_gs_list_%id%`

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
};