const mTxServCommand = require('../mTxServCommand.js')
const ConverterApi = require('../../api/ConverterApi.js')
const Discord = require('discord.js')
const UrlParser = require('js-video-url-parser')

module.exports = class ConvertCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'convert-mp3',
            aliases: ['conversion-mp3', 'mp3'],
            group: 'convert',
            memberName: 'convert-mp3',
            description: 'Convert Youtube Videos or SoundCloud Music to MP3',
            clientPermissions: ['SEND_MESSAGES'],
            ownerOnly: true,
            hidden: true,
            args: [
                
                {
                    key: 'query',
                    prompt: 'Which music (Youtube or SoundCloud URL) do you want to convert?',
                    type: 'string',
                    validate: url => {
                        const details = UrlParser.parse(url)
                        return details.provider === 'youtube' || details.provider === 'soundcloud'
                    }
                },
            ],
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg, { query }) {
        const details = UrlParser.parse(query)

        const isYoutube = details.provider === 'youtube'

        msg.react('🔃');

        const api = new ConverterApi()
        let results;

        switch (details.provider) {
            case 'youtube':
                results = await api.convertYoutube(details.id)
                break;

            case 'soundcloud':
                results = await api.convertSoundcloud(query)
                break;

            default:
                throw new Error(`Provider ${details.provider} is not managed`)
        }

        // On check si on a un résultat correct
        setTimeout(() => {
            if ( results == "" || (results.error && results.error != "") ) {
                msg.react('❌');
                msg.reactions.cache.get('✅').remove();
                return
            }
        }, 1000)

        // Traitement du message
        const phrase = results.title && results.author ? `*${results.title}* fait par *${results.author}*` : query
        const embed = new Discord.MessageEmbed()
            .setAuthor(`Conversion de : ${phrase}`)
            .setColor('BLUE')
            .setTimestamp()
        ;

        if (!isYoutube || results.already) {
            embed.addField('La musique est disponible :', results.link);
        }

        if ( results != "" || (results.error && results.error != "") ) {
            msg.channel.send({embed}) // Use a 2d array?
            .then(async function (message) {
                if (isYoutube && !results.already && results) {
                    const intervalObj = setInterval(() => {
                        // Re-fetch the message and get reaction counts
                        message.channel.messages
                            .fetch(message.id)
                            .then(async function (message) {
                                const embed2 = new Discord.MessageEmbed()
                                    .setAuthor(`Conversion de : ${phrase}`)
                                    .setColor('BLUE')
                                    .setTimestamp()
                                ;

                                const result = await api.getstatusYT(query)

                                if (result.progress.percentage == 100) {
                                    embed2.addField('La musique est disponible :', results.link);

                                    clearInterval(intervalObj);
                                } else {
                                    embed2.addField("Conversion en cours :", `${Math.round(result.progress.percentage)} %` )
                                    embed2.addField("Temps estimée :", result.progress.eta)
                                    embed2.setTimestamp();
                                }

                                message.edit("", embed2);
                            })
                        ;
                    }, 1000);
                }

            }).catch(console.error);
        }
    }
};
