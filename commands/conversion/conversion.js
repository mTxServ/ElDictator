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
                    prompt: 'Which music you want to convert?',
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
        
        var video_id = query.split('v=')[1] || query;
        var ampersandPosition = video_id.indexOf('&');
        if(ampersandPosition != -1) {
          video_id = video_id.substring(0, ampersandPosition);
        }
        
        if ( video_id != query ) {
          var query = video_id
          yt = true 
        }

        msg.react('✅');

        const results = await api.conversion(query, yt)

        if ( results.error && results.error != "" ) {
            msg.react('❌');
            msg.reactions.cache.get('✅').remove().catch(error => console.error('Failed to remove reactions: ', error));
            return
        }

        const phrase = results.title && results.author ? `*${results.title}* fait par *${results.author}*` : query
        const embed = new Discord.MessageEmbed()
            .setTitle(`Conversion de : ${phrase}`)
            .setColor('BLUE')
            .setTimestamp()
        ;

        console.log(results.link)

        embed.addField('La musique est disponible :', results.link);

        return msg.say({
            embed
        });
    }
};
