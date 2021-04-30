const got = require('got');
const Discord = require('discord.js')

const makeURL = (game, query) => `https://mtxserv.com/api/v1/game/softwares/${encodeURIComponent(game)}/search?query=${encodeURIComponent(query)}`;

class GameSoftwareApi {
    async search(game, query) {
        const res = await got(makeURL(game, query), {
            responseType: 'json'
        })

        if (!res || !res.body) {
            throw new Error('Invalid response of mtxserv API')
        }

        return res.body
    }

    generateSoftwareEmbed(software, userLang, baseUrl) {
        const lang = require(`../languages/${userLang}.json`);

        const embed = new Discord.MessageEmbed()
            .setTitle(`${software.name}`)
            .setColor('BLUE')
        ;

        if (software.picture_path) {
            embed.setThumbnail(`https://mtxserv.com/build/${software.picture_path}`)
        }

        const description = userLang == 'fr' ? (software.description || software.description_en) : (software.description_en || software.description)
        embed.setDescription(description)


        if (software.latest_version) {
            embed.addField(':hammer_pick: ' + lang['gamesoftware']['version'], software.latest_version.replace('pour ', ''), true)
        }

        if (software.website_url) {
            embed.addField(':link: ' + lang['gamesoftware']['website'], software.website_url, true)
        }

        const link = `${baseUrl}/${software.id}-${software.slug}`
        embed.addField(':book: ' + lang['gamesoftware']['howto'], link)

        return embed
    }
}

module.exports = GameSoftwareApi;
