const got = require('got');
const cheerio = require('cheerio');

const makeURL = (addonId) => `http://steamworkshop.download/download/view/${encodeURIComponent(addonId)}`;

class WorkshopDownloaderApi {
    async getDownloadLinkOf(addonId) {
        const res = await got(makeURL(addonId))

        if (!res || !res.body) {
            throw new Error('Invalid response of Workshop Downloader Api')
        }

        let downloadLink = null

        if (-1 !== res.body.indexOf('Can\'t download this file')) {
            return downloadLink;
        }

        const $ = cheerio.load(res.body);
        $('#wrapper > div.width2 > div > table > tbody > tr > td > b > a').each(function() {
            downloadLink = $(this).attr('href');
        });

        return downloadLink
    }
}

module.exports = WorkshopDownloaderApi;
