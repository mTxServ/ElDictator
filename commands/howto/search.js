const mTxServCommand = require('../mTxServCommand.js');

module.exports = class HowToSearchCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'howto',
            aliases: ['search'],
            group: 'howto',
            memberName: 'howto',
            description: 'Search a tutorial.',
            clientPermissions: ['SEND_MESSAGES'],
            args: [
                {
                    key: 'query',
                    prompt: 'Which tutorial did you search?',
                    type: 'string',
                    validate: text => text.length > 3,
                },
            ],
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    run(msg, { query }) {
        return msg.say(query);
    }
};