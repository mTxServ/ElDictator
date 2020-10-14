const mTxServCommand = require('../mTxServCommand.js')
const ConversionAPI = require('../../api/ConversionAPI')
const Discord = require('discord.js')

module.exports = class ConversionCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'conversion',
            aliases: ['search', 'tuto'],
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
        const userLang = locale === 'all' ? this.resolveLangOfMessage(msg) : locale || this.resolveLangOfMessage(msg);
        const lang = require(`../../languages/${userLang}.json`);

        const api = new ConversionAPI()
        var yt = false
        
        var video_id = window.location.search.split('v=')[1];
        var ampersandPosition = video_id.indexOf('&');
        if(ampersandPosition != -1) {
          video_id = video_id.substring(0, ampersandPosition);
        }
        
        if ( video_id ) {
          var query = video_id
          yt = true 
        }
        
        const results = await api.conversion(query, yt)

        const embed = new Discord.MessageEmbed()
            .setTitle(`Convertion de *${query}*`)
            .setColor('BLUE')
            .setLink(results["link"])
        ;

        embed.addField("La musique est disponible : " `${results["links"]}`);

        return msg.say({
            embed
        });
    }
};
