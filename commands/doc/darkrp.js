const mTxServCommand = require('../mTxServCommand.js')
const DarkRPApi = require('../../api/DarkRPApi')
const Discord = require('discord.js')

module.exports = class DocDarkRPCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'darkrp',
            aliases: ['darkrp-wiki'],
            group: 'gmod',
            memberName: 'darkrp',
            description: 'Search on DarkRP official wiki',
            clientPermissions: ['SEND_MESSAGES'],
            args: [
                {
                    key: 'query',
                    prompt: 'Which query did you search?',
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
        const userLang = await this.resolveLangOfMessage(msg)
        const lang = require(`../../languages/${userLang}.json`);

        const api = new DarkRPApi();
        const results = await api.search(query);

        const embed = new Discord.MessageEmbed()
            .setTimestamp()
            .setTitle(`:mag: ${lang['wiki']['search']} *${query}*`)
            .setColor('BLUE')
        ;

        if (!results.length) {
            embed
                .setColor('RED')
                .addField(lang['wiki']['no_result'], `${lang['wiki']['check']} <https://darkrp.miraheze.org/>`);

            return msg.say({
                embed
            });
        }

        results
            .map(article => {
                embed.addField(`:book: ${article.title}`, `<https://darkrp.miraheze.org/wiki/${article.title}>` || 'n/a');
            })
        ;

        return msg.say({
            embed
        });
    }
};