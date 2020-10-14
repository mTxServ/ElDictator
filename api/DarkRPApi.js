const got = require('got');

const makeURL = (query) => `https://darkrp.miraheze.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srwhat=title&format=json`;

class DarkRPApi {
    async search(query) {
        const res = await got(makeURL(query), {
            responseType: 'json'
        })

        if (!res || !res.body) {
            throw new Error('Invalid response of DarkRP API')
        }

        return res.body.query.search
    }
}

module.exports = DarkRPApi;
