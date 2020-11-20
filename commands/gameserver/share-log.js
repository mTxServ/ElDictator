const mTxServCommand = require('../mTxServCommand.js')
const Discord = require('discord.js')
const ShareLogApi = require('../../api/ShareLogApi')

module.exports = class ShareLogcommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'log',
            aliases: ['share-log', 'gist'],
            group: 'gameserver',
            memberName: 'log',
            description: 'Share a log',
            clientPermissions: ['SEND_MESSAGES'],
            guarded: true,
            args: [
                {
                    key: 'content',
                    prompt: 'Log content',
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

    async run(msg, {content}) {
        const api = new ShareLogApi()
        const result = await api.share(content)

        if (!result.success) {
            return this.sayError(msg, 'Une erreur est survenue.')
        }

        msg.delete()

        return this.saySuccess(msg, result.url)
    }
};