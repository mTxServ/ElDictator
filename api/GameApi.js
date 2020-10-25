const got = require('got');

const makeRankingURL = (endpoint, game) => `${endpoint}${encodeURIComponent(game)}`;

class GameApi {
    async getRankingOfGame(game) {
        const res = await got(makeRankingURL(process.env.RANKING_URL, GameApi.translateGameSlug(game)), {
            responseType: 'json'
        })

        if (!res || !res.body) {
            throw new Error('Invalid response of GameServer Ranking API')
        }

        return res.body
    }

    static translateGameSlug(gameSlug) {
        switch (gameSlug) {
            case 'gmod':
                return 'garrys-mod';

            case 'csgo':
                return 'cs';

            case 'fivem':
                return 'gta';

            default:
                return gameSlug
        }
    }
}

module.exports = GameApi;
