const got = require('got');

const makeURLYoutube = (query) => `http://92.222.234.121:8080/${encodeURIComponent(query)}`;
const makeURLSoundcloud = (query) => `http://92.222.234.121/soundcloud/download.php?url=${encodeURIComponent(query)}`;
const makeURLYTStatus = (query) => `http://92.222.234.121:8080/logs/${encodeURIComponent(query)}.txt`;

class ConverterApi {
    async convertYoutube(query) {
        const res = await got(makeURLYoutube(query), {
            responseType: 'json'
        })

        if (!res || !res.body) {
            throw new Error('Invalid response of Conversion API')
        }

        return res.body
    }

    async convertSoundcloud(query) {
        const res = await got(makeURLSoundcloud(query), {
            responseType: 'json'
        })

        if (!res || !res.body) {
            throw new Error('Invalid response of Conversion API')
        }

        return res.body
    }

    async getstatusYT(query) {
        const res = await got(makeURLYTStatus(query), {
            responseType: 'json'
        })

        if (!res || !res.body) {
            throw new Error('Invalid response of Conversion API')
        }

        return res.body
    }
}

module.exports = ConverterApi;
