const mTxServCommand = require('../mTxServCommand.js')
const CoverGeneratorApi = require('../../api/CoverGeneratorApi')

module.exports = class CoverGeneratorCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'cover',
            aliases: ['cover-generator'],
            group: 'image',
            memberName: 'cover',
            description: 'Generate a cover image',
            clientPermissions: ['SEND_MESSAGES'],
            args: [
                {
                    key: 'title',
                    prompt: 'Which title did you want?',
                    type: 'string',
                    validate: text => text.length >= 3,
                },
                {
                    key: 'backgroundUrl',
                    prompt: 'Which background image (URL) did you want?',
                    type: 'string',
                    default: ''
                },
            ],
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg, { title, backgroundUrl }) {
        const api = new CoverGeneratorApi();
        return api.start(await this.resolveLangOfMessage(msg), msg, title, backgroundUrl);
    }
};