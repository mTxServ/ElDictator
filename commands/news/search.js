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
            guarded: true,
            args: [
                {
                    key: 'query',
                    prompt: 'Which tutorial did you search?',
                    type: 'string',
                    validate: text => text.length >= 3,
                },
                {
                    key: 'locale',
                    prompt: 'Which language (fr/en/all)?',
                    type: 'string',
                    default: 'all',
                    oneOf: ['fr', 'en', 'all'],
                },
            ],
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg, { query, locale }) {
        const userLang = locale === 'all' ? await this.resolveLangOfMessage(msg) : locale || await this.resolveLangOfMessage(msg);
        const lang = require(`../../languages/${userLang}.json`);

        const api = new HowToApi()
        const results = await api.search(query)

        const embed = new Discord.MessageEmbed()
            .setTitle(`:mag: ${lang['how_to']['search']} *${query}*`)
            .setColor('BLUE')
        ;

        const tutorials = Object.values(results);

        tutorials
            .filter(article => {
                return locale === 'all' || article.locale == userLang
            })
            .map(article => {
                embed.addField(`${article.locale == 'fr' ? ':flag_fr:' : ':flag_us:'} ${article.title}`, `<${article.link}>` || 'n/a');
            })
        ;

        if (!embed.fields.length) {
            const helpUrl = userLang == 'fr' ? 'https://mtxserv.com/fr/help': 'https://mtxserv.com/help';
            embed
                .setColor('RED')
                .addField(lang['how_to']['no_result'], `${lang['how_to']['check']} <${helpUrl}>`);
        }

        embed.fields = embed.fields.slice(0, 3);

        return msg.say({
            embed
        });
    }
};