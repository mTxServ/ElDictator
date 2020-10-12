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
        const lang = require(`../../languages/fr.json`);

        const embed = new Discord.MessageEmbed()
            .setTitle(lang['forkme']['title'])
            .setURL('https://github.com/mTxServ')
            .setColor('BLUE')
            .setDescription(lang['forkme']['description'])
            .addField("Comment contribuer?", "Nous serions très heureux de recevoir de l'aide de développeurs qui peuvent nous aider à réparer des bogues ou ajouter de nouvelles fonctionnalités.")
            .addField("GitHub", 'https://github.com/mTxServ/ElDictator');

        return msg.channel.send({
            embed
        });
    }
};