const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js');

module.exports = class SocialCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'forkme',
            aliases: ['fork', 'bot'],
            group: 'mtxserv',
            memberName: 'forkme',
            description: 'Contribute to this bot!',
            clientPermissions: ['SEND_MESSAGES'],
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg) {
        const lang = require(`../../languages/${this.resolveLangOfMessage(msg)}.json`);

        const embed = new Discord.MessageEmbed()
            .setTitle(lang['fork_me']['title'])
            .setURL('https://github.com/mTxServ/ElDictator')
            .setColor('BLUE')
            .setDescription(lang['fork_me']['description'])
            .addField(lang['fork_me']['how'], lang['fork_me']['explain'])
            .addField("GitHub", 'https://github.com/mTxServ/ElDictator');

        return msg.say({
            embed
        });
    }
};