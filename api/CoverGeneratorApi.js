const got = require('got');
const Discord = require('discord.js')

const makeURL = (templateId) => `https://placid.app/api/rest/${encodeURIComponent(templateId)}`;
const defaultBackgroundUrl = 'https://mtxserv.com/build/manager/minecraft_en.png';
const templateId = '8rqlymvby'

class CoverGeneratorApi {
    async generateCover(title, backgroundImageUrl) {
        const options = {
            responseType: 'json',
            headers: {
                'Authorization': `Bearer ${process.env.PLACID_TOKEN}`
            },
            json: {
                'create_now': true,
                'fields': {
                    'title': {
                        'text': title.trim()
                    }
                }
            }
        }

        if (backgroundImageUrl) {
            options.json.fields.cover = {
                'image': {
                    'imageSrc': 'link',
                    'imageUrl': backgroundImageUrl
                }
            }
        }

        const res = await got.post(makeURL(templateId), options)

        if (!res || !res.body) {
            throw new Error('Invalid response of Placid API')
        }

        return res.body
    }

    async getPolling(pollingUrl) {
        const res = await got(pollingUrl, {
            responseType: 'json',
            headers: {
                'Authorization': `Bearer ${process.env.PLACID_TOKEN}`
            }
        })

        if (!res || !res.body) {
            throw new Error('Invalid response of Placid API')
        }

        return res.body
    }

    async start (userLang, msg, title, backgroundUrl) {
        const lang = require(`../languages/${userLang}.json`);

        msg.delete();

        const embed = new Discord.MessageEmbed()
            .setTitle(`:arrows_clockwise: ${lang['cover']['launch'].replace('%text%', title)}`)
            .setColor('WARNING')
            .setFooter(msg.content.split(' ').join(' '))
        ;

        const notificationMessage = await msg.say({
            embed
        });

        const result = await this.generateCover(title, backgroundUrl||defaultBackgroundUrl);

        if (result.status !== 'finished') { //  && result.status !== 'queued'
            console.error(result)

            embed
                .setTitle(`${lang['cover']['error']}`)
                .setColor('RED')
                .setDescription(lang['cover']['error_message'])

            return msg.say({
                embed
            });
        }

        const self = this;
        const checkState = async function(latestResult) {
            if (latestResult.status === 'queued') {
                const result = await self.getPolling(latestResult.polling_url)
                if (result.status === 'queued') {
                    setTimeout(function() {
                        checkState(result)
                    }, 2000)
                    return;
                }
            }

            if (latestResult.status !== 'finished') {
                console.error(latestResult)
                return;
            }

            embed
                .setTitle(`:frame_photo: ${lang['cover']['success']}`)
                .setImage(result.image_url)
                .setColor('GREEN')
                .setDescription(result.image_url)

            notificationMessage.edit(embed);
        }

        checkState(result);
    }

    getRandomBackgroundOfGame(game) {
        const data = JSON.parse(`{
            "ark":{
                "cover":[
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/ark\\/1.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/ark\\/2.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/ark\\/3.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/ark\\/4.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/ark\\/5.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/ark\\/6.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/ark\\/8.jpg"
                ]
            },
            "garry-s-mod":{
                "cover":[
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/gmod\\/1.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/gmod\\/2.png",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/gmod\\/2.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/gmod\\/3.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/gmod\\/4.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/gmod\\/5.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/gmod\\/6.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/gmod\\/7.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/gmod\\/8.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/gmod\\/9.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/gmod\\/10.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/gmod\\/11.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/gmod\\/12.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/gmod\\/13.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/gmod\\/14.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/gmod\\/15.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/gmod\\/16.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/gmod\\/17.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/gmod\\/18.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/gmod\\/19.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/gmod\\/20.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/gmod\\/21.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/gmod\\/22.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/gmod\\/23.png",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/gmod\\/24.jpg"
                ]
            },
            "minecraft":{
                "cover":[
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/minecraft\\/1.png",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/minecraft\\/2.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/minecraft\\/3.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/minecraft\\/4.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/minecraft\\/5.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/minecraft\\/6.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/minecraft\\/7.png",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/minecraft\\/8.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/minecraft\\/9.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/minecraft\\/10.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/minecraft\\/11.jpg"
                ]
            },
            "rust":{
                "cover":[
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/rust\\/1.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/rust\\/2.png",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/rust\\/3.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/rust\\/4.png",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/rust\\/5.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/rust\\/6.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/rust\\/7.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/rust\\/8.jpg"
                ]
            },
            "hytale":{
                "cover":[
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/hytale\\/1.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/hytale\\/2.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/hytale\\/3.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/hytale\\/4.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/hytale\\/5.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/hytale\\/6.jpg"
                ]
            },
            "onset":{
                "cover":[
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/onset\\/1.png",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/onset\\/2.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/onset\\/3.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/onset\\/4.jpg",
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/cover\\/onset\\/5.jpg"
                ]
            },
            "vps":{
                "cover":[
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/vps\\/vps_game_fr.png"
                ]
            },
            "default":{
                "cover":[
                    "https:\\/\\/mtxserv.com\\/build\\/img\\/mtxserv.png"
                ]
            }
        }`)

        const backgrounds = typeof data[game] !== 'undefined' ? data[game].cover : data.default.cover;
        return backgrounds[Math.floor(Math.random() * backgrounds.length)];
    }
}

module.exports = CoverGeneratorApi;
