const got = require('got');

const makeURL = (page) => `https://mee6.xyz/api/plugins/levels/leaderboard/529605510219956233?page=${encodeURIComponent(page)}`;

class CarlGGApi {
    async getPlayersPage(page) {
        const res = await got(makeURL(page), {
            responseType: 'json'
        })

        if (!res || !res.body) {
            throw new Error('Invalid response of Carl.gg API')
        }

        return res.body.players
    }
}

module.exports = CarlGGApi;
