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
            guarded: true,
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg) {
        const userLang = this.resolveLangOfMessage(msg);
        const lang = require(`../../languages/${userLang}.json`);

        const links = [
            {
                platform: ':flag_fr: Twitter',
                link: 'https://twitter.com/mTxServ',
                locale: ['fr'],
            },
            {
                platform: ':flag_us: Twitter',
                link: 'https://twitter.com/mTxServ_EN',
                locale: ['en'],
            },
            {
                platform: ':flag_us: GitHub',
                link: 'https://github.com/mTxServ',
                locale: ['fr', 'en'],
            },
            {
                platform: ':flag_fr: Forums d\'entraide',
                link: 'https://mtxserv.com/forums/',
                locale: ['fr'],
            },
            {
                platform: ':flag_fr: Facebook',
                link: 'https://www.facebook.com/mtxserv',
                locale: ['fr'],
            },
            {
                platform: ':flag_fr: Youtube',
                link: 'https://www.youtube.com/mtxserv',
                locale: ['fr'],
            },
        ]

        const embed = new Discord.MessageEmbed()
            .setTitle(lang['social_links']['title'])
            .setColor('BLUE')
        ;

        for (const k in links) {
            if (-1 === links[k]['locale'].indexOf(userLang)) {
                continue;
            }

            embed.addField(links[k].platform, `${links[k].link}`)
        }

        return msg.say({
            embed
        });
    }
};