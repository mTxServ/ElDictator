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
        return msg
            .say('Stopping the bot.. :eyes:')
            .then(process.exit)
    }
};