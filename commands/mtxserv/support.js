const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js');

module.exports = class SupportCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'support',
            aliases: ['supports', 'ticket', 'tickets', 's'],
            group: 'mtxserv',
            memberName: 'support',
            description: 'Get support informations',
            clientPermissions: ['SEND_MESSAGES'],
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg) {
        const userLang = this.resolveLangOfMessage(msg)
        const lang = require(`../../languages/${userLang}.json`)

        const embed = new Discord.MessageEmbed()
            .setTitle(lang['support']['title'])
            .setDescription(lang['support']['description'])
            .setColor('BLUE')
            .addField(lang['support']['before'], userLang === 'fr' ? 'https://mtxserv.com/fr/help' : 'https://mtxserv.com/help')
            .addField(lang['support']['support'], userLang === 'fr' ? 'https://mtxserv.com/fr/support/list' : 'https://mtxserv.com/support/list', true)
            .addField(lang['support']['create'], userLang === 'fr' ? 'https://mtxserv.com/fr/support/new' : 'https://mtxserv.com/support/new', true)
            .addField(lang['support']['report'], ':star:')
        ;

        return msg.say({
            embed
        })
    }
};