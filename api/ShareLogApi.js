const got = require('got');

const makeShareURL = () => `https://log.mtxserv.com/api/1/log`;

class ShareLogApi {
    async share(content) {
        const res = await got.post(makeShareURL(), {
            responseType: 'json',
            form: {
                content: content
            }
        })

        if (!res || !res.body) {
            throw new Error('Invalid response of OAuth2 API')
        }

        return res.body
    }
}

module.exports = ShareLogApi;
