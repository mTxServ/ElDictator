const got = require('got');

const makeURL = (game, host, port) => `https://mtxserv.com/api/v1/viewers/game?ip=${encodeURIComponent(host)}&port=${encodeURIComponent(port)}&type=${encodeURIComponent(game)}`;

class GameServerApi {
    async status(game, host, port) {
        if (game === 'gmod') {
            game = 'garry-s-mod';
        }

        const res = await got(makeURL(game, host, port), {
            responseType: 'json'
        })

        if (!res || !res.body) {
            throw new Error('Invalid response of mtxserv API')
        }

        return res.body
    }
}

module.exports = GameServerApi;
