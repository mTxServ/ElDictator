const got = require('got');

const makeAuthURL = (clientId, clientSecret, apiKey) => `https://mtxserv.com/oauth/v2/token?grant_type=${encodeURIComponent('https://mtxserv.com/grants/api_key')}&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}&api_key=${encodeURIComponent(apiKey)}`;

class mTxServApi {
    async login(clientId, clientSecret, apiKey) {
        const res = await got(makeAuthURL(clientId, clientSecret, apiKey), {
            responseType: 'json'
        })

        if (!res || !res.body) {
            throw new Error('Invalid response of mtxserv oauth API')
        }

        return res.body
    }

    setCredential(authorId, credentials) {
        client.settings.set(`auth_${authorId}`, credentials)
    }

    isAuthenticated(authorId) {
        return client.settings.get(`auth_${authorId}`, false)
    }

    logout(authorId) {
        client.settings.remove(`auth_${authorId}`)
    }
}

module.exports = mTxServApi;
