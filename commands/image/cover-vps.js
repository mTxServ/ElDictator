const mTxServCommand = require('../mTxServCommand.js')
const CoverGeneratorApi = require('../../api/CoverGeneratorApi')

module.exports = class CoverGeneratorVpsCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'cover-vps',
            group: 'image',
            memberName: 'cover-vps',
            description: 'Generate a VPS cover image',
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
        return api.start(this.resolveLangOfMessage(msg), msg, title, api.getRandomBackgroundOfGame('vps'));
    }
};