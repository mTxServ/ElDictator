const mTxServCommand = require('../mTxServCommand.js')
const HowToApi = require('../../api/HowToApi')
const Discord = require('discord.js')

module.exports = class HowToSearchCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'howto',
            aliases: ['search', 'tuto'],
            group: 'howto',
            memberName: 'howto',
            description: 'Search a tutorial.',
            clientPermissions: ['SEND_MESSAGES'],
            args: [
                {
                    key: 'query',
                    prompt: 'Which tutorial did you search?',
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
        const api = new HowToApi()
        const tutorials = await api.search(query)

        const embed = new Discord.MessageEmbed()
            .setColor(3447003)
            .setTitle(`:books: Search *${query}*`)
        ;

        if (!tutorials.length) {
            embed.addField(':flag_us: No result found.', 'Check on <https://mtxserv.com/help>');
            embed.addField(':flag_fr: Aucun résultat trouvé.', 'Vérifiez sur <https://mtxserv.com/fr/help>');
        }

        Object.values(tutorials.slice(0, 3))
            .map(article => {
                embed.addField(`${article.locale.toUpperCase() == 'fr' ? 'flag_fr:' : ':flag_us:'} ${article.title}`, `<${article.link}>` || 'n/a');
            })
        ;

        return msg.say({
            embed
        });
    }
};