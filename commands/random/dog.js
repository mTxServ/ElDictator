const mTxServCommand = require('../mTxServCommand.js')
const got = require('got');

module.exports = class DogCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'dog',
            aliases: ['puppy'],
            group: 'random',
            memberName: 'dog',
            description: 'Responds with a random dog image.',
            clientPermissions: ['ATTACH_FILES'],
            credit: [
                {
                    name: 'Dog CEO',
                    url: 'https://dog.ceo/',
                    reason: 'Dog API',
                    reasonURL: 'https://dog.ceo/dog-api/'
                }
            ]
        });
    }

    async run(msg) {
        try {
            const res = await got('https://dog.ceo/api/breeds/image/random', {
                responseType: 'json',
            })

            if (!res || !res.body) {
                throw new Error('Invalid response of Dog API')
            }

            return msg.say({ files: [res.body.message] });
        } catch (err) {
            return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
        }
    }
};