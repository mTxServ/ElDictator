const mTxServCommand = require('../mTxServCommand.js')
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
            guarded: true,
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg) {
        const lang = require(`../../languages/${await this.resolveLangOfMessage(msg)}.json`)

        const api = new mTxServApi()
        const isAuthenticated = await api.isAuthenticated(msg.author.id)

        if (!isAuthenticated) {
            return this.sayError(msg, lang['logout']['not_logged'])
        }

        await api.logout(msg.author.id)

        return this.saySuccess(msg, lang['logout']['success'])
    }
};