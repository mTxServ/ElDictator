const mTxServCommand = require('../mTxServCommand.js');

module.exports = class BotStopCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'stop',
            aliases: ['bot-stop'],
            group: 'admin',
            memberName: 'stop',
            description: 'Stop the discord bot.',
            clientPermissions: ['SEND_MESSAGES'],
            ownerOnly: true,
            hidden: true,
        });
    }

    run(msg) {
        const lang = require(`../../languages/${this.getLangOfMember(msg.member)}.json`);

        return msg
            .say(lang['bot_stop']['confirm'])
            .then(process.exit)
    }
};