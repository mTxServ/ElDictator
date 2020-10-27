const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js');
require('moment-duration-format');

module.exports = class SuggestConfigCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'suggest-set-channel',
            aliases: ['suggest-set'],
            group: 'bot',
            memberName: '-channel',
            description: 'Set suggests channels.',
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
                {
                    key: 'channel',
                    prompt: 'Which channel used to post suggestion?',
                    type: 'channel',
                },
            ],
        });
    }

    async run(msg, {language, channel}) {
        const currentConfig = await this.client.provider.get(channel.guild.id, 'suggest-config', {})
        currentConfig[language] = channel.id

        await this.client.provider.set(channel.guild.id, 'suggest-config', currentConfig)

        return this.saySuccess(msg, `The suggestion channel for the **${language}** language has been set to \`${channel.name}\`.`)
    }
};