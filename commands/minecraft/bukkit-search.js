const mTxServCommand = require('../mTxServCommand.js')
const BukkitApi = require('../../api/BukkitApi.js')
const Discord = require('discord.js')

module.exports = class BukkitSearchCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'bukkit-search',
            aliases: ['bukkit-plugin'],
            group: 'minecraft',
            memberName: 'minecraft',
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

        const plugins = Object.values(results);

        plugins
            .map(plugin => {
                embed.addField(`${plugin.name}`, `<${plugin.view_url}>` || 'n/a');
                embed.addField(`${lang['plugin_search']['description']}`, `${plugin.description_en}` || 'n/a');
            })
        ;

//         if (!embed.fields.length) {
//             const helpUrl = userLang == 'fr' ? 'https://mtxserv.com/fr/help': 'https://mtxserv.com/help';
//             embed
//                 .setColor('RED')
//                 .addField(lang['spigot_search']['no_result'], `${lang['plugin_search']['check']} <${helpUrl}>`);
//         }

        embed.fields = embed.fields.slice(0, 3);

        return msg.say({
            embed
        });
    }
};
