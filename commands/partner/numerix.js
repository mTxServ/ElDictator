const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js');

module.exports = class NumerixCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'numerix',
            aliases: ['numerix-addons'],
            group: 'mtxserv',
            memberName: 'numerix',
            description: 'Show who is Numerix',
            clientPermissions: ['SEND_MESSAGES'],
            guarded: true,
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg) {
        const userLang = await this.resolveLangOfMessage(msg);
        const lang = require(`../../languages/${userLang}.json`);

        const addons = [
            {
                name: 'Cinematic Intro',
                link: 'https://mtxserv.com/forums/ressources/release-cinematic-intro-server.1148/',
                locale: ['fr']
            },
            {
                name: 'Radio',
                link: 'https://mtxserv.com/forums/ressources/release-radio-youtube-mp3-soundcloud.1328/',
                locale: ['fr']
            },
            {
                name: 'F4Menu (Style : Identity)',
                link: 'https://mtxserv.com/forums/ressources/release-f4menu-style-identity.1133/',
                locale: ['fr']
            },
            {
                name: 'Menu Echap (Style : Identity)',
                link: 'https://mtxserv.com/forums/ressources/release-menu-echap-style-identity.1073/',
                locale: ['fr']
            },
            
            {
                name: 'Cinematic Intro',
                link: 'https://steamcommunity.com/sharedfiles/filedetails/?id=1989480899',
                locale: ['en']
            },
            {
                name: 'Radio',
                link: 'https://steamcommunity.com/sharedfiles/filedetails/?id=1989484474',
                locale: ['en']
            },
            {
                name: 'F4Menu (Identity theme)',
                link: 'https://steamcommunity.com/sharedfiles/filedetails/?id=1989483709',
                locale: ['en']
            },
            {
                name: 'Escape Menu (Identity theme)',
                link: 'https://steamcommunity.com/sharedfiles/filedetails/?id=1989483334',
                locale: ['en']
            },
        ]

        const embed = new Discord.MessageEmbed()
            .setTitle('Numerix')
            .setColor('BLUE')
            .setDescription(lang['partners']['numerix'])
       ;

        for (const k in addons) {
            if (-1 === addons[k]['locale'].indexOf(userLang)) {
                continue;
            }

            embed.addField(addons[k].name, `${addons[k].link}`)
        }

        return msg.say({
            embed
        });
    }
};
