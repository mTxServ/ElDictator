const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js');

module.exports = class SocialCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'social',
            aliases: ['socials', 'twitter', 'facebook', 'github', 'youtube'],
            group: 'mtxserv',
            memberName: 'social',
            description: 'Show social links',
            clientPermissions: ['SEND_MESSAGES'],
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg) {
        const lang = require(`../../languages/fr.json`);

        const links = [
            {
                platform: ':flag_fr: Twitter',
                link: 'https://twitter.com/mTxServ',
            },
            {
                platform: ':flag_us: Twitter',
                link: 'https://twitter.com/mTxServ_EN',
            },
            {
                platform: ':flag_us: GitHub',
                link: 'https://github.com/mTxServ',
            },
            {
                platform: ':flag_fr: Forums d\'entraide',
                link: 'https://mtxserv.com/forums/',
            },
            {
                platform: ':flag_fr: Facebook',
                link: 'https://www.facebook.com/mtxserv',
            },
            {
                platform: ':flag_fr: Youtube',
                link: 'https://www.youtube.com/mtxserv',
            },
        ]

        const embed = new Discord.MessageEmbed()
            .setTitle(lang['social_links']['title'])
            .setColor('BLUE')
        ;

        for (const k in links) {
            embed.addField(links[k].platform, `${links[k].link}`)
        }

        return msg.say({
            embed
        });
    }
};