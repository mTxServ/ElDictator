const mTxServCommand = require('../mTxServCommand.js')
const mTxServApi = require('../../api/mTxServApi')

module.exports = class AccountCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'me',
            aliases: ['account'],
            group: 'mtxserv',
            memberName: 'me',
            description: 'Show my user profile',
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
            return this.sayError(msg, lang['me']['not_logged'])
        }

        return this.saySuccess(msg, lang['me']['logged'])
    }
};