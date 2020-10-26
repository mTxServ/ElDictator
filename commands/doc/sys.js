const mTxServCommand = require('../mTxServCommand.js')
const Discord = require('discord.js')
const HostingerApi = require('../../api/HostingerApi')

module.exports = class DocGluaCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'sys',
            aliases: ['system', 'vps-howto', 'howto-vps', 'vps'],
            group: 'howto',
            memberName: 'glua',
            description: 'Search administration system guide',
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
        const lang = require(`../../languages/${await this.resolveLangOfMessage(msg)}.json`);

        const api = new HostingerApi()
        const results = await api.search(query)

        const embed = new Discord.MessageEmbed()
            .setTitle(`:mag: ${lang['how_to']['search']} *${query}*`)
            .setColor('BLUE')
        ;

        if (!results.length) {
            embed
                .setColor('RED')
                .setDescription(lang['how_to']['no_result'])
            ;

            return await msg.say({
                embed
            });
        }

        const articles = Object.values(results).slice(0, 10)
        for (const article of articles) {
            embed.addField(`:flag_us: ${article.title}`, `<${article.link}>`);
        }

        return msg.say({
            embed
        });
    }
};