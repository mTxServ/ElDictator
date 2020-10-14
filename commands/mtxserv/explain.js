const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js');

module.exports = class SupportCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'explain',
            aliases: ['explique'],
            group: 'mtxserv',
            memberName: 'explain',
            description: 'Display explain message',
            clientPermissions: ['SEND_MESSAGES'],
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg, { type }) {
        const userLang = this.resolveLangOfMessage(msg)
        const lang = require(`../../languages/${userLang}.json`)

        const embed = new Discord.MessageEmbed()
            .setTitle(lang['explain']['title'])
            .setDescription(`${lang['explain']['description']}\n\n${lang['explain']['rule_1']}\n${lang['explain']['rule_2']}\n${lang['explain']['rule_3']}\n${lang['explain']['rule_4']}\n${lang['explain']['rule_5']}\n${lang['explain']['rule_6']}`)
            .setColor('BLUE')
        ;

        return msg.say({
            embed
        })
    }
};