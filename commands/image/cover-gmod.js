const mTxServCommand = require('../mTxServCommand.js')
const CoverGeneratorApi = require('../../api/CoverGeneratorApi')

module.exports = class CoverGeneratorGModCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'cover-gmod',
            group: 'image',
            memberName: 'cover-gmod',
            description: 'Generate a GMod cover image',
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
        return api.start(await this.resolveLangOfMessage(msg), msg, title, api.getRandomBackgroundOfGame('garry-s-mod'));
    }
};