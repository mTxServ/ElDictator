const mTxServCommand = require('../mTxServCommand.js');
const ARKApi = require('../../api/ARKApi')
const Discord = require('discord.js');

module.exports = class ArkVersionCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'ark-version',
            aliases: ['ark-latest', 'ark-v'],
            group: 'ark',
            memberName: 'ark-version',
            description: 'Show the latest version of ARK',
            clientPermissions: ['SEND_MESSAGES'],
            guarded: true,
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg) {
        const lang = require(`../../languages/${await this.resolveLangOfMessage(msg)}.json`)

        const api = new ARKApi()
        const latestVersion = await api.latestVersion()

        return this.saySuccess(msg, lang['ark_version']['message'].replace('%version%', latestVersion))
    }
};