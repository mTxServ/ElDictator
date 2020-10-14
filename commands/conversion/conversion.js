const mTxServCommand = require('../mTxServCommand.js')
const ConversionAPI = require('../../api/ConversionAPI')
const Discord = require('discord.js')

module.exports = class ConversionCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'conversion',
            aliases: [],
            group: 'conversion',
            memberName: 'conversion',
            description: 'Convert Youtube Videos or SoundCloud Music',
            clientPermissions: ['SEND_MESSAGES'],
            args: [
                {
                    key: 'query',
                    prompt: 'Which music do you want to convert?',
                    type: 'string',
                    validate: text => text.length >= 3,
                },
            ],
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg, { query }) {
        const api = new ConversionAPI()
        var yt = false
        
        var video_id = query.split('v=')[1] || query; // On récupère l'ID YT ou on garde le lien soundcloud
        var ampersandPosition = video_id.indexOf('&');
        if(ampersandPosition != -1) {
          video_id = video_id.substring(0, ampersandPosition);
        }
        
        if ( video_id != query ) { // On regarde si on va traiter une vidéo YT
          var query = video_id
          yt = true 
        }

        msg.react('✅');

        const results = await api.conversion(query, yt) || false

        // On check si on a un résultat correct
        setTimeout(() => {
            if ( results == "" || (results.error && results.error != "") ) {
                msg.react('❌');
                msg.reactions.cache.get('✅').remove().catch(error => console.error('Failed to remove reactions: ', error));
                return
            }
        }, 1000)

        // Traitement du message
        const phrase = results.title && results.author ? `*${results.title}* fait par *${results.author}*` : query
        const embed = new Discord.MessageEmbed()
            .setTitle(`Conversion de : ${phrase}`)
            .setColor('BLUE')
            .setTimestamp()
        ;

        if (!yt || results.already) {
            embed.addField('La musique est disponible :', results.link);
        }        
        
        if ( results != "" || (results.error && results.error != "") ) {
            msg.channel.send({embed}) // Use a 2d array?
            .then(async function (message) {
                if (yt && !results.already && results) {
                    const intervalObj = setInterval(() => {
                    // Re-fetch the message and get reaction counts
                    message.channel.messages.fetch(message.id)
                    .then(async function (message) {
                        const embed2 = new Discord.MessageEmbed()
                            .setTitle(`Conversion de : ${phrase}`)
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
                    });
                    }, 1000);
                }

            }).catch(console.error);
        }
    }
};
