const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js');
require('moment-duration-format');

module.exports = class LanguageCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'bot-lang',
            aliases: ['bot-language'],
            group: 'bot',
            memberName: 'bot-lang',
            description: 'Set bot language bot infos.',
            guarded: true,
            guildOnly: true,
            userPermissions: ['ADMINISTRATOR'],
            clientPermissions: ['SEND_MESSAGES'],
            args: [
                {
                    key: 'language',
                    prompt: 'Which language did you want (fr/en)?',
                    type: 'string',
                    oneOf: ['fr', 'en'],
                },
            ],
        });
    }

    run(msg, {language}) {
        this.client.provider.set(msg.guild.id, 'language', language)
        const lang = require(`../../languages/${language}.json`)
        return this.saySuccess(msg, lang['language']['updated'].replace('%lang%', language))
    }
};