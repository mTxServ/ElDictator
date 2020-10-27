const got = require('got');

const makeAuthURL = (clientId, clientSecret, apiKey) => `https://mtxserv.com/oauth/v2/token?grant_type=${encodeURIComponent('https://mtxserv.com/grants/api_key')}&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}&api_key=${encodeURIComponent(apiKey)}`;
const makeApiURL = (accessToken, uri) => `https://mtxserv.com/api/v1/${uri}?access_token=${encodeURIComponent(accessToken)}`;

class mTxServApi {
    async login(clientId, clientSecret, apiKey) {
        const res = await got(makeAuthURL(clientId, clientSecret, apiKey), {
            responseType: 'json'
        })

        if (!res || !res.body) {
            throw new Error('Invalid response of OAuth2 API')
        }

        return res.body
    }

    async loginFromCredentials(userId) {
        const credentials = await this.getCredential(userId)
        if (credentials) {
            return await this.login(credentials.clientId, credentials.clientSecret, credentials.apiKey)
        }

        throw new Error(`Credentials not found for ${userId}`)
    }

    async getCredential(userId) {
        if (!await this.isAuthenticated(userId)) {
            throw new Error(`User ${userId} isn't authenticated, can't get credentials`)
        }

        return await client.provider.get('users', userId, false)
    }

    async setCredential(userId, credentials) {
        await client.provider.set('users', userId, credentials)
    }

    async isAuthenticated(userId) {
        return await client.provider.get('users', userId, false) !== false
    }

    async logout(userId) {
        return await client.provider.remove('users', userId)
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
