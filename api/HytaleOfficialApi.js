const got = require('got');
const Discord = require('discord.js')

const makeURL = () => `https://hytale.com/api/blog/post/published`;

class HytaleOfficialApi {
    async latest() {
        const res = await got(makeURL(), {
            responseType: 'json'
        })

        if (!res || !res.body) {
            throw new Error('Invalid response of Hytale API')
        }

        return res.body
    }
}

module.exports = HytaleOfficialApi;
