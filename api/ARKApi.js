const got = require('got');

const makeURL = () => `http://arkdedicated.com/version`;

class ARKApi {
    async latestVersion() {
        const res = await got(makeURL())

        if (!res || !res.body) {
            throw new Error('Invalid response of ARK API')
        }

        return res.body
    }
}

module.exports = ARKApi;
