const got = require('got');

const makeURL = (query) => `https://mtxserv.com/api/v1/articles/?query=${encodeURIComponent(query)}`;

class BukkitApi {
    async search(query) {
        const res = await got(makeURL(query), {
            responseType: 'json'
        })

        if (!res || !res.body) {
            throw new Error('Invalid response of mtxserv API')
        }

        return res.body
    }
}

module.exports = BukkitApi;
