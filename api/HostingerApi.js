const got = require('got');
const cheerio = require('cheerio');

const makeURL = (query) => `https://www.hostinger.com/tutorials/?s=${encodeURIComponent(query)}`;

class HostingerApi {
    async search(query) {
        const res = await got(makeURL(query))

        if (!res || !res.body) {
            throw new Error('Invalid response of Hostinger API')
        }

        const $ = cheerio.load(res.body);
        const results = [];

        $('.tutorials-list__cards-container a.tutorials-list__card').each(function() {
            const link = $(this).attr('href');
            const title = $(this).find('h3.text-h-primary').text()

            if (link && title) {
                results.push({
                    title: title.trim(),
                    link: link,
                })
            }
        });

        return results
    }
}

module.exports = HostingerApi;
