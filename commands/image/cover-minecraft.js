const mTxServCommand = require('../mTxServCommand.js')
const CoverGeneratorApi = require('../../api/CoverGeneratorApi')

module.exports = class CoverGeneratorMinecraftCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'cover-minecraft',
            aliases: ['cover-minecraft', 'cover-mc'],
            group: 'image',
            memberName: 'cover-minecraft',
            description: 'Generate a Minecraft cover image',
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
        return api.start(this.resolveLangOfMessage(msg), msg, title, api.getRandomBackgroundOfGame('minecraft'));
    }
};