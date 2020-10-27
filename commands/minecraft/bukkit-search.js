const mTxServCommand = require('../mTxServCommand.js')
const BukkitApi = require('../../api/BukkitApi.js')
const Discord = require('discord.js')

module.exports = class BukkitSearchCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'bukkit-search',
            aliases: ['bukkit-plugin'],
            group: 'minecraft',
            memberName: 'bukkit-search',
            description: 'Search a Bukkit plugin.',
            clientPermissions: ['SEND_MESSAGES'],
            guarded: true,
            args: [
                {
                    key: 'query',
                    prompt: 'Which bukkit plugin did you search?',
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

        const api = new BukkitApi()
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
