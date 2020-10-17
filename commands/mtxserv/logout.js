const mTxServCommand = require('../mTxServCommand.js')
const Discord = require('discord.js')
const mTxServApi = require('../../api/mTxServApi')

module.exports = class LogoutCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'logout',
            aliases: ['exit'],
            group: 'mtxserv',
            memberName: 'logout',
            description: 'Remove link of your discord account with your mTxServ account',
            clientPermissions: ['SEND_MESSAGES'],
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    run(msg) {
        const lang = require(`../../languages/${this.resolveLangOfMessage(msg)}.json`)

        const api = new mTxServApi()
        const isAuthenticated = api.isAuthenticated(msg.author.id)

        if (!isAuthenticated) {
            return this.sayError(msg, lang['logout']['not_logged'])
        }

        api.logout(msg.author.id)

        return this.saySuccess(msg, lang['logout']['success'])
    }
};