const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js');

module.exports = class SupportCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'invite',
            aliases: ['i'],
            group: 'mtxserv',
            memberName: 'invite',
            description: 'Get support informations',
            clientPermissions: ['SEND_MESSAGES'],
            guarded: true,
            guildOnly: true,
            ownerOnly: true,
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg) {
        const userLang = await this.resolveLangOfMessage(msg)
        const lang = require(`../../languages/${userLang}.json`)

        const invitation = await this.client.inviteManager.createInvitationLink(msg.guild, msg.author.id)
        if (!invitation || !invitation.code) {
            return this.sayError(msg, 'An error occured when creating your invitation link :(')
        }

        const embed = new Discord.MessageEmbed()
            .setDescription(`Votre lien d'invitation personnel est: https://discord.com/invite/${invitation.code}.`)
            .setColor('BLUE')
        ;

        return msg.say({
            content: `https://discord.com/invite/${invitation.code}`,
            embed: embed,
        })
    }
};