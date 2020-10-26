const mTxServCommand = require('../mTxServCommand.js')
const CoverGeneratorApi = require('../../api/CoverGeneratorApi')

module.exports = class CoverGeneratorARKCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'cover-ark',
            group: 'image',
            memberName: 'cover-ark',
            description: 'Generate a ARK cover image',
            clientPermissions: ['SEND_MESSAGES'],
            args: [
                {
                    key: 'title',
                    prompt: 'Which title did you want?',
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

    async run(msg, { title}) {
        const api = new CoverGeneratorApi();
        return api.start(await this.resolveLangOfMessage(msg), msg, title, api.getRandomBackgroundOfGame('ark'));
    }
};