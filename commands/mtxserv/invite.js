const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js');

module.exports = class SocialCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'invite',
            aliases: ['invite-link'],
            group: 'mtxserv',
            memberName: 'invite',
            description: 'Get invitation link to join mTxServ discord',
            clientPermissions: ['SEND_MESSAGES'],
            guarded: true,
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg) {
        const lang = require(`../../languages/${this.resolveLangOfMessage(msg)}.json`);

        const embed = new Discord.MessageEmbed()
            .setTitle(lang['invite']['title'])
            .setColor('BLUE')
            .setDescription(lang['invite']['description'])
            .addField(lang['invite']['link'], this.client.options.invite);

        return msg.say({
            embed
        });
    }
};