const got = require('got');

const makeAuthURL = (clientId, clientSecret, apiKey) => `https://mtxserv.com/oauth/v2/token?grant_type=${encodeURIComponent('https://mtxserv.com/grants/api_key')}&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}&api_key=${encodeURIComponent(apiKey)}`;
const makeApiURL = (accessToken, uri) => `https://mtxserv.com/api/v1/${uri}?access_token=${encodeURIComponent(accessToken)}`;

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

    async loginFromCredentials(authorId) {
        const credentials = this.getCredential(authorId)
        return this.login(credentials.clientId, credentials.clientSecret, credentials.apiKey)
    }

    getCredential(authorId) {
        if (!this.isAuthenticated(authorId)) {
            throw new Error(`user ${authorId} isn't authenticated, can't get credentials`)
        }

        return client.settings.get(`auth_${authorId}`)
    }

    setCredential(authorId, credentials) {
        client.settings.set(`auth_${authorId}`, credentials)
    }

    isAuthenticated(authorId) {
        return client.settings.get(`auth_${authorId}`, false) !== false
    }

    logout(authorId) {
        client.settings.remove(`auth_${authorId}`)
    }

    async call(accessToken, uri) {
        const res = await got(makeApiURL(accessToken, uri), {
            responseType: 'json'
        })

        if (!res || !res.body) {
            throw new Error('Invalid response of mtxserv oauth API')
        }

        return res.body
    }
}

module.exports = mTxServApi;
