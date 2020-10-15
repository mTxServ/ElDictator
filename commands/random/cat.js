const mTxServCommand = require('../mTxServCommand.js')
const got = require('got');

module.exports = class CatCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'cat',
            aliases: ['meow'],
            group: 'random',
            memberName: 'cat',
            description: 'Responds with a random cat image.',
            clientPermissions: ['ATTACH_FILES'],
            credit: [
                {
                    name: 'TheCatAPI',
                    url: 'https://thecatapi.com/',
                    reason: 'API',
                    reasonURL: 'https://docs.thecatapi.com/'
                }
            ]
        });
    }

    async run(msg) {
        try {
            const res = await got('https://api.thecatapi.com/v1/images/search?limit=1', {
                responseType: 'json',
            })

            if (!res || !res.body) {
                throw new Error('Invalid response of Cat API')
            }

            return msg.say({ files: [res.body[0].url] });
        } catch (err) {
            return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
        }
    }
};