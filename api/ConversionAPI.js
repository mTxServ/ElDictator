const got = require('got');

const makeURLYT = (query) => `http://92.222.234.121:8080/${encodeURIComponent(query)}`;
const makeURLSC = (query) => `http://92.222.234.121/soundcloud/download.php?url=${encodeURIComponent(query)}`;

class ConversionAPI {
    async conversion(query, yt) {
        if (yt) {
          const res = await got(makeURLYT(query), {
            responseType: 'json'
          })
        }
        else {
          const res = await got(makeURLSC(query), {
            responseType: 'json'
          })
        }

        if (!res || !res.body) {
            throw new Error('Invalid response of Numerix API')
        }

        return res.body
    }
}

module.exports = ConversionAPI;
