const mTxServCommand = require('../mTxServCommand.js')
const SpigotApi = require('../../api/SpigotApi.js')
const Discord = require('discord.js')

module.exports = class SpigotSearchCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'spigot-search',
            aliases: ['spigot-plugin'],
            group: 'minecraft',
            memberName: 'spigot-search',
            description: 'Search a Spigot plugin.',
            clientPermissions: ['SEND_MESSAGES'],
            guarded: true,
            args: [
                {
                    key: 'query',
                    prompt: 'Which spigot plugin did you search?',
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

    async run(msg, { query, locale }) {
        const userLang = locale === 'all' ? await this.resolveLangOfMessage(msg) : locale || await this.resolveLangOfMessage(msg);
        const lang = require(`../../languages/${userLang}.json`);

        const api = new SpigotApi()
        const results = await api.search(query)

        const embed = new Discord.MessageEmbed()
            .setTitle(`:mag: ${lang['plugin_search']['search']} *${query}*`)
            .setColor('BLUE')
        ;

        Object.values(results)
            .map(plugin => {
                embed.addField(`・ ${plugin.name}`, `${plugin.description_en}\n<${plugin.view_url}>` || 'n/a');
            })
        ;

        embed.fields = embed.fields.slice(0, 3);

        return msg.say({
            embed
        });
    }
};
