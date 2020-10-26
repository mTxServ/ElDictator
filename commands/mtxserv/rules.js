const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js');

module.exports = class SocialCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'rules',
            aliases: ['regle', 'regles', 'reglement', 'rule'],
            group: 'mtxserv',
            memberName: 'rules',
            description: 'Get rules of this Discord',
            clientPermissions: ['SEND_MESSAGES'],
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg) {
        const lang = require(`../../languages/${await this.resolveLangOfMessage(msg)}.json`);

        const embed = new Discord.MessageEmbed()
            .setTitle(lang['rules']['title'])
            .setColor('BLUE')
            .setDescription(lang['rules']['description'])
        ;

        return msg.say({
            embed
        });
    }
};