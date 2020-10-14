const got = require('got');

const makeURLYT = (query) => `http://92.222.234.121:8080/${encodeURIComponent(query)}`;
const makeURLYTStatus = (query) => `http://92.222.234.121:8080/logs/${encodeURIComponent(query)}.txt`;

const makeURLSC = (query) => `http://92.222.234.121/soundcloud/download.php?url=${encodeURIComponent(query)}`;

class ConversionAPI {
    async conversion(query, yt) {
        if (yt) {
            if ( query.length == 11 ) {
                var res = await got(makeURLYT(query), {
                    responseType: 'json'
                })
            }
        }
        else {
            var res = await got(makeURLSC(query), {
                responseType: 'json'
            })
        }

        if (!res || !res.body) {
            return ""
        }
        
        console.log(res.body)
        return res.body
    }

    async getstatusYT(query) {
        const res = await got(makeURLYTStatus(query), {
            responseType: 'json'
        })

        if (!res || !res.body) {
            throw new Error('Invalid response of Numerix API')
        }

        console.log(res.body)
        return res.body
    }
}

module.exports = ConversionAPI;
