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
            ownerOnly: true,
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
        const lang = require(`../../languages/${this.resolveLangOfMessage(msg)}.json`)

        this.guildSettings.setLanguage(msg.guild.id, language)

        return this.saySuccess(msg, `La langue du bot est désormais \`${language}\``)
    }
};