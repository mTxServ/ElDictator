const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js');

module.exports = class NumerixCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'numerix',
            aliases: ['numerix addons', 'addons', 'tutoriels'],
            group: 'mtxserv',
            memberName: 'numerix',
            description: 'Show who is Numerix',
            clientPermissions: ['SEND_MESSAGES'],
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg) {
        const userLang = this.getLangOfMember(msg.member);
        const lang = require(`../../languages/${userLang}.json`);

        const addons = [
            {
                name: 'Cinematic Intro',
                link: 'https://mtxserv.com/forums/ressources/release-cinematic-intro-server.1148/',
            },
            {
                name: 'Radio',
                link: 'https://mtxserv.com/forums/ressources/release-radio-youtube-mp3-soundcloud.1328/,
            },
            {
                name: 'F4Menu (Style : Identity)',
                link: 'https://mtxserv.com/forums/ressources/release-f4menu-style-identity.1133/',
            },
            {
                name: 'Menu Echap (Style : Identity)',
                link: 'https://mtxserv.com/forums/ressources/release-menu-echap-style-identity.1073/',
            },
        ]

        const embed = new Discord.MessageEmbed()
            .setTitle("Numerix")
            .setColor('BLUE')
        ;
        
        embed.addField("Numerix est un développeur et un helpeur. Il a publié différents addons et tutoriels. En voici quelques un :")

        for (const k in links) {
            embed.addField(addons[k].name, `${addons[k].link}`)
        }

        return msg.say({
            embed
        });
    }
};
