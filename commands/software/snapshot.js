const mTxServCommand = require('../mTxServCommand.js')
const GameSoftwareApi = require('../../api/GameSoftwareApi')
const Discord = require('discord.js')

module.exports = class GameSoftwareSnapshotCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'snapshot',
            group: 'minecraft',
            memberName: 'snapshot',
            description: 'Show Minecraft Snapshot version.',
            clientPermissions: ['SEND_MESSAGES'],
        });
    }

    async run(msg) {
        const userLang = await this.resolveLangOfMessage(msg);
        const lang = require(`../../languages/${userLang}.json`);
        const baseUrl = userLang == 'fr' ? 'https://mtxserv.com/fr/minecraft-versions': 'https://mtxserv.com/minecraft-versions';

        const query = 'Snapshot';
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

        const embed = api.generateSoftwareEmbed(softwares[0], userLang, baseUrl)

        return msg.say({
            embed
        });
    }
};