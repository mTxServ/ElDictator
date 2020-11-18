const mTxServCommand = require('../mTxServCommand.js')
const ConverterApi = require('../../api/ConverterApi.js')
const Discord = require('discord.js')
const UrlParser = require('js-video-url-parser')

module.exports = class ConvertCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'convert-mp3',
            aliases: ['conversion-mp3', 'mp3'],
            group: 'util',
            memberName: 'convert-mp3',
            description: 'Convert Youtube Videos or SoundCloud Music to MP3',
            clientPermissions: ['SEND_MESSAGES'],
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

        // Traitement du message
        let phrase = results.title && results.author ? `*${results.title}* fait par *${results.author}*` : query
        const embed = new Discord.MessageEmbed()
            .setTitle(`Conversion de : ${phrase}`)
            .setColor('BLUE')
            .setTimestamp()
        ;

        setTimeout(() => {
            // On check si on a un résultat correct
            if ( results.error && results.error != "" ) {
                msg.react('❌');
                msg.reactions.cache.get('🔃').remove();
                
                return
            }

            // Traitement SoundCloud
            if (!isYoutube) {
                embed.addField('La musique est disponible :', results.link);
    
                msg.reactions.cache.get('🔃').remove();
                msg.react('✅');

                msg.channel.send({embed})
            }
        }, 500)

        // Traitement Youtube
        if ( isYoutube && (!results.error || results.error == "") ) {
            msg.channel.send({embed}) // Use a 2d array?
            .then(async function (message) {
                if (isYoutube && results) {
                    const intervalObj = setInterval(() => {
                        // Refresh message to show status of conversion
                        message.channel.messages
                            .fetch(message.id)
                            .then(async function (message) {
                                const result = await api.getstatusYT(details.id)
                                phrase = result.title && result.artist ? `*${result.title}* fait par *${result.artist}*` : query
                                
                                const embed2 = new Discord.MessageEmbed()
                                    .setTitle(`Conversion de : ${phrase}`)
                                    .setColor('BLUE')
                                    .setTimestamp()
                                ;
                                
                                console.log(typeof(result))
                                if (!result.progress && !result.videoTitle) {
                                    msg.reactions.cache.get('🔃').remove();
                                    msg.react('❌');
                                    message.delete();

                                    clearInterval(intervalObj);
                                    
                                    return   
                                }

                                if ( (result.progress && result.progress.percentage == 100) || result.videoTitle) {
                                    embed2.addField('La musique est disponible :', results.link);                       // On a fini le traitement
                                    embed2.setTitle(`Conversion de : ${phrase}`)

                                    msg.reactions.cache.get('🔃').remove();
                                    msg.react('✅');

                                    clearInterval(intervalObj);
                                } else {
                                    embed2.addField("Conversion en cours :", `${Math.round(result.progress.percentage)} %` )        // On continuue le traitement
                                    embed2.addField("Temps estimée :", `${result.progress.eta} secondes`)
                                    embed2.setTimestamp();
                                }

                                message.edit("", embed2);
                            })
                        ;
                    }, 3000);
                }

            }).catch(console.error);
        }
    }
};
