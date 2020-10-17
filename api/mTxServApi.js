const got = require('got');

const makeAuthURL = (clientId, clientSecret, apiKey) => `https://mtxserv.com/oauth/v2/token?grant_type=${encodeURIComponent('https://mtxserv.com/grants/api_key')}&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}&api_key=${encodeURIComponent(apiKey)}`;

class mTxServApi {
    constructor(clientId, clientSecret, apiKey) {
        this.clientId = clientId
        this.clientSecret = clientSecret
        this.apiKey = apiKey
    }

    async login() {
        const res = await got(makeAuthURL(this.clientId, this.clientSecret, this.apiKey), {
            responseType: 'json'
        })

        if (!res || !res.body) {
            throw new Error('Invalid response of mtxserv oauth API')
        }

        return res.body
    }

    isAuthenticated(authorId) {
        return client.settings.get(`auth_${authorId}`, false)
    }

    logout(authorId) {
        return client.settings.remove(`auth_${authorId}`)
    }
}

module.exports = mTxServApi;
