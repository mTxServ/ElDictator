const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js');

module.exports = class PartnerCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'partners',
            aliases: ['partenaires', 'partenaire', 'partner'],
            group: 'partner',
            memberName: 'partners',
            description: 'Show partners',
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

        const partners = [
            {
                name: ':flag_us: Top Games',
                websiteUrl: 'https://top-games.net/',
                description: 'Find the game server that will make your heart fall on one of our Top Servers.',
                locale: ['en']
            },
            {
                name: ':flag_fr: HYTALE.game',
                inviteUrl: 'https://discord.gg/2UPCQn3',
                websiteUrl: 'https://hytale.game',
                description: 'Toutes les news, màj et astuces sur Hytale, 1ère communauté :flag_fr:',
                locale: ['fr']
            },
            {
                name: ':flag_fr: Minecraft.fr',
                inviteUrl: 'https://discord.com/invite/minecraftfr',
                websiteUrl: 'https://minecraft.fr',
                description: 'Première communauté francophone sur le jeu Minecraft.',
                locale: ['fr']
            },
            {
                name: ':flag_fr: Top Serveur',
                websiteUrl: 'https://top-serveurs.net/',
                description: 'Trouvez le serveur de jeu qui fera chavirer votre coeur et présentez vos serveurs.',
                locale: ['fr']
            },
            {
                name: ':flag_fr: Game Creators Area',
                inviteUrl: 'https://discord.gg/bjDJJjy',
                websiteUrl: 'https://g-ca.fr',
                description: 'GCA a été créé pour offrir un lieu où peuvent se rencontrer les créateurs de contenu.',
                locale: ['fr']
            },
            {
                name: ':flag_fr: Numerix',
                inviteUrl: 'https://discord.gg/dCsjxaZ',
                websiteUrl: 'https://mtxserv.com/forums/ressources/authors/numerix.49891/',
                description: 'Numerix est un déveleppeur et un helpeur. Il a mis à disposition gratuitement différents addons et tutoriels disponibles sur mTxServ.',
                locale: ['fr']
            },
            {
                name: ':crown: Metropia: Roleplay Minecraft Imagination',
                inviteUrl: 'https://discord.com/invite/gCkTQS8',
                websiteUrl: 'https://metropia.cf/',
                description: 'Découvrez le premier serveur Minecraft Roleplay francophone imagination et sans limite!',
                locale: ['fr']
            },
        ]

        const embed = new Discord.MessageEmbed()
            .setTitle(lang['partners']['list'])
            .setColor('BLUE')
            // .setAuthor(msg.client.user.tag, msg.client.user.displayAvatarURL())
        ;

        for (const k in partners) {
            if (-1 === partners[k]['locale'].indexOf(userLang)) {
                continue;
            }

            embed.addField(partners[k].name, `${partners[k].description}\n:link: ${partners[k].websiteUrl} ${partners[k].inviteUrl?'- ' + partners[k].inviteUrl : ''}`)
        }

        return msg.say({
            embed
        });
    }
};
