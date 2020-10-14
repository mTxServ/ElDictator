const mTxServCommand = require('../mTxServCommand.js')
const GameSoftwareApi = require('../../api/GameSoftwareApi')
const Discord = require('discord.js')

module.exports = class GameSoftwareSearchCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'version',
            aliases: ['versions', 'software', 'softwares', 'modpack', 'modpacks'],
            group: 'gameserver',
            memberName: 'version',
            description: 'Search a minecraft version or modpack.',
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

    async run(msg, { query}) {
        const userLang = this.resolveLangOfMessage(msg);
        const lang = require(`../../languages/${userLang}.json`);
        const baseUrl = userLang == 'fr' ? 'https://mtxserv.com/fr/minecraft-versions': 'https://mtxserv.com/minecraft-versions';

        const api = new GameSoftwareApi()
        const results = await api.search('minecraft', query)
        const softwares = Object.values(results);

        if (!softwares.length) {
            const embed = new Discord.MessageEmbed()
                .setTitle(`:mag: ${lang['software_search']['search']} *${query}*`)
                .setColor('RED')
                .addField(lang['software_search']['no_result'], `${lang['how_to']['check']} <${baseUrl}>`)
            ;

            return msg.say({
                embed
            });
        }

        softwares
            .slice(0, 3)
            .map(software => {
                const embed = api.generateSoftwareEmbed(software, userLang, baseUrl)

                msg.say({
                    embed
                });
            })
        ;
    }
};