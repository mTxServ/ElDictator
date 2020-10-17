const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js');

module.exports = class GCACommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'gca',
            aliases: ['g-ca'],
            group: 'partner',
            memberName: 'gca',
            description: 'Show who is gca',
            clientPermissions: ['SEND_MESSAGES'],
            guarded: true,
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg) {
        const lang = require(`../../languages/${this.resolveLangOfMessage(msg)}.json`)

        const embed = new Discord.MessageEmbed()
            .setAuthor('Game Creators Area', 'https://g-ca.fr/favicon.ico', 'https://discord.gg/bjDJJjy')
            .setColor('BLUE')
            .setDescription(lang['gca']['description'])
            .addField('Website', `[g-ca.fr](https://g-ca.fr)`, true)
            .addField('Discord', `[Join GCA](https://discord.gg/bjDJJjy)`, true)
            .setImage('https://g-ca.fr/gca-thumb.png')
       ;

        return msg.say({
            embed
        });
    }
};
