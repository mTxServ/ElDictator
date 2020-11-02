const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js');

module.exports = class StockCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'faq',
            group: 'mtxserv',
            memberName: 'faq',
            description: 'Show FAQ of mTxServ',
            clientPermissions: ['SEND_MESSAGES'],
            guarded: true,
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg) {
        const userLang = await this.resolveLangOfMessage(msg)
        const lang = require(`../../languages/${userLang}.json`);

        const faq = {
            fr: [
                {
                    "@type": "Question",
                    "name": "Quels\u0020sont\u0020les\u0020d\u00E9lais\u0020de\u0020livraison\u0020\u003F",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "La\u0020livraison\u0020de\u0020votre\u0020commande\u0020intervient\u0020d\u00E8s\u0020validation\u0020du\u0020paiement\u0020par\u0020l\u0027organisme\u0020financier.\u0020Une\u0020fois\u0020le\u0020paiement\u0020valid\u00E9,\u0020la\u0020livraison\u0020d\u0027un\u0020serveur\u0020intervient\u0020g\u00E9n\u00E9ralement\u0020dans\u0020la\u0020minute,\u0020qu\u0027importe\u0020l\u0027heure\u0020du\u0020jour\u0020ou\u0020de\u0020la\u0020nuit\u0020\u0021"
                    }
                }, {
                    "@type": "Question",
                    "name": "Quel\u0020mat\u00E9riel\u0020utilisez\u002Dvous\u0020\u003F",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Nos\u0020services\u0020d\u0027h\u00E9bergement\u0020de\u0020serveur\u0020de\u0020jeu\u0020utilisent\u0020du\u0020mat\u00E9riel\u0020derni\u00E8re\u0020g\u00E9n\u00E9ration.\u0020Nous\u0020utilisons\u0020des\u0020processeurs\u0020AMD\u0020Ryzen\u00203800X\u0020\u0040\u00204,5GHz,\u0020de\u0020la\u0020RAM\u0020DDR4\u0020ECC\u00202666\u0020MHz,\u0020des\u0020disques\u0020NVMe\u0020et\u0020un\u0020r\u00E9seau\u0020faible\u0020latence\u00201\u0020Gbit\/s\u0020prot\u00E9g\u00E9\u0020par\u0020une\u0020protection\u0020DDoS\u0020L7."
                    }
                }, {
                    "@type": "Question",
                    "name": "O\u00F9\u0020sont\u0020situ\u00E9s\u0020vos\u0020serveurs\u003F",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Nos\u0020serveurs\u0020de\u0020jeux\u0020sont\u0020pr\u00E9sents\u0020dans\u0020plusieurs\u0020pays\u0020\u00E0\u0020travers\u0020le\u0020monde.\u0020En\u0020Europe,\u0020nos\u0020centres\u0020de\u0020donn\u00E9es\u0020sont\u0020en\u0020France,\u0020Angleterre,\u0020Allemagne\u0020et\u0020Pologne.\u0020Cot\u00E9\u0020nord\u002Dam\u00E9ricain,\u0020USA\u0020Est,\u0020USA\u0020Ouest\u0020et\u0020Canada."
                    }
                }, {
                    "@type": "Question",
                    "name": "Quand\u0020est\u0020ce\u0020que\u0020mon\u0020serveur\u0020est\u0020sauvegard\u00E9\u0020\u003F",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Votre\u0020serveur\u0020de\u0020jeu\u0020est\u0020sauvegard\u00E9\u0020toutes\u0020les\u00206\u0020heures,\u0020ainsi\u0020qu\u0027\u00E0\u0020chaque\u0020arr\u00EAt.\u0020Vos\u0020sauvegardes\u0020sont\u0020conserv\u00E9es\u0020pendant\u00201\u0020an\u0020apr\u00E8s\u0020expiration\u0020du\u0020contrat,\u0020vous\u0020permettant\u0020de\u0020les\u0020restaurer\u0020en\u00201\u002Dclic\u0020ult\u00E9rieurement."
                    }
                }, {
                    "@type": "Question",
                    "name": "Est\u002Dil\u0020possible\u0020de\u0020changer\u0020d\u0027offre\u0020\u003F",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Chez\u0020mTxServ\u0020nous\u0020n\u0027utilisons\u0020que\u0020du\u0020mat\u00E9riel\u0020haut\u0020de\u0020gamme\u0020et\u0020tout\u0020a\u0020\u00E9t\u00E9\u0020pens\u00E9\u0020pour\u0020une\u0020simplicit\u00E9\u0020maximale.\u0020Vous\u0020pouvez\u0020changer\u0020d\u0027offre\u0020en\u00201\u0020clic\u0020depuis\u0020le\u0020panel,\u0020dans\u0020la\u0020limite\u0020d\u0027un\u0020changement\u0020tous\u0020les\u002015\u0020jours.\u0020Le\u0020temps\u0020restant\u0020au\u0020contrat\u0020sera\u0020alors\u0020converti\u0020sur\u0020la\u0020nouvelle\u0020offre\u0020et\u0020vous\u0020b\u00E9n\u00E9ficierez\u0020instantan\u00E9ment\u0020de\u0020la\u0020nouvelle\u0020offre\u0020choisie,\u0020sans\u0020changement\u0020de\u0020l\u0027adresse\u0020de\u0020votre\u0020serveur,\u0020ni\u0020perte\u0020de\u0020donn\u00E9es.\u0020\u0028Limite\u003A\u0020un\u0020changement\u0020d\u0027offre\u0020tous\u0020les\u002015\u0020jours\u0020maximum\u0029"
                    }
                }, {
                    "@type": "Question",
                    "name": "Quels\u0020moyens\u0020de\u0020paiement\u0020sont\u0020disponibles\u0020\u003F",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Vous\u0020pouvez\u0020payer\u0020directement\u0020par\u0020CB,\u0020Paypal\u0020et\u0020Tokens.\u0020Les\u0020tokens\u0020\u0028monnaie\u0020virtuelle\u0020exclusive\u0020\u00E0\u0020notre\u0020site\u0029\u0020peuvent\u0020\u00EAtre\u0020cr\u00E9dit\u00E9s\u0020par\u0020CB,\u0020Paypal,\u0020PaySafeCard\u0020et\u0020appels\/codes\u0020mobiles.\u0020Cr\u00E9ditez\u0020vos\u0020tokens,\u0020\u00E9changez\u002Dles\u0020avec\u0020d\u0027autres\u0020membres\u0020et\u0020payez\u0020vos\u0020services\u0020en\u0020toute\u0020simplicit\u00E9\u0020\u0021\u0020Le\u0020taux\u0020de\u0020reversement\u0020des\u0020tokens\u0020peut\u0020varier\u0020selon\u0020le\u0020mode\u0020de\u0020paiement\u0020choisi,\u0020consultez\u0020la\u0020page\u0020correspondante."
                    }
                }, {
                    "@type": "Question",
                    "name": "Pourquoi\u0020louer\u0020un\u0020serveur\u0020mTxServ\u0020plut\u00F4t\u0020qu\u0027un\u0020serveur\u0020d\u00E9di\u00E9\u0020\/\u0020VPS\u0020\u003F",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "H\u00E9berger\u0020un\u0020serveur\u0020de\u0020jeu\u0020peut\u0020para\u00EEtre\u0020simple\u0020avec\u0020quelques\u0020connaissance\u0020mais\u0020maintenir\u0020un\u0020h\u00E9bergement\u0020qualitatif\u0020requiert\u0020du\u0020temps\u0020et\u0020une\u0020certaine\u0020rigueur.\u0020Avec\u0020mTxServ,\u0020vous\u0020b\u00E9n\u00E9ficiez\u0020en\u0020quelques\u0020clics\u0020d\u0027un\u0020serveur\u0020surpuissant\u0020h\u00E9berg\u00E9\u0020sur\u0020du\u0020mat\u00E9riel\u0020haut\u0020de\u0020gamme,\u0020d\u0027un\u0020panel\u0020de\u0020derni\u00E8re\u0020g\u00E9n\u00E9ration\u0020pour\u0020g\u00E9rer\u0020simplement\u0020le\u0020serveur,\u0020de\u0020nombreuses\u0020sauvegardes\u0020redond\u00E9es,\u0020d\u0027un\u0020h\u00E9bergement\u0020web\u0020gratuit\u0020avec\u0020base\u0020de\u0020donn\u00E9es\u0020MySQL\u0020pour\u0020vos\u0020addons\/plugins\u0020et\u0020surtout\u0020d\u0027un\u0020support\u0020\u00E0\u0020votre\u0020\u00E9coute\u0020pour\u0020vous\u0020accompagner\u0020au\u0020quotidien.\u0020Faire\u0020le\u0020choix\u0020d\u0027un\u0020h\u00E9bergeur\u0020comme\u0020mTxServ,\u0020c\u0027est\u0020b\u00E9n\u00E9ficier\u0020de\u0020ce\u0020qu\u0027il\u0020se\u0020fait\u0020de\u0020mieux,\u0020vous\u0020permettant\u0020de\u0020vous\u0020concentrer\u0020sur\u0020vos\u0020jeux\u0020pr\u00E9f\u00E9r\u00E9s\u0020et\u0020surtout\u0020votre\u0020communaut\u00E9\u0020\u0021"
                    }
                }, {
                    "@type": "Question",
                    "name": "Qui\u0020est\u0020derri\u00E8re\u0020mTxServ\u0020\u003F",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Cr\u00E9\u00E9e\u0020en\u00202009\u0020par\u0020des\u0020joueurs\u0020passionn\u00E9s\u0020qui\u0020sont\u0020toujours\u0020aux\u0020manettes,\u0020mTxServ\u0020a\u0020fructifi\u00E9\u0020au\u0020fil\u0020du\u0020temps\u0020et\u0020de\u0020notre\u0020exp\u00E9rience\u0020pour\u0020offrir\u0020aux\u0020joueurs\u0020une\u0020exp\u00E9rience\u0020optimale\u0020sur\u0020leurs\u0020jeux\u0020pr\u00E9f\u00E9r\u00E9s.\u0020Devenus\u0020par\u0020ailleurs\u0020experts\u0020de\u0020l\u0027h\u00E9bergement\u0020de\u0020services\u0020en\u0020ligne\u0020pour\u0020des\u0020clients\u0020professionnels,\u0020nous\u0020sommes\u0020\u00E0\u0020m\u00EAme\u0020de\u0020proposer\u0020nos\u0020services\u0020de\u0020qualit\u00E9\u0020au\u0020plus\u0020grand\u0020nombre.\u0020Des\u0020serveurs\u0020g\u00E9r\u00E9s\u0020et\u0020optimis\u00E9s\u0020par\u0020des\u0020professionnels\u0020de\u0020l\u0027h\u00E9bergement,\u0020c\u0027est\u0020aussi\u0020ce\u0020qui\u0020rend\u0020nos\u0020serveurs\u0020si\u0020qualitatifs\u0020\u003B\u002D\u0029"
                    }
                }, {
                    "@type": "Question",
                    "name": "Quel\u0020panel\u0020de\u0020gestion\u0020utilisons\u002Dnous\u0020\u003F",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Chez\u0020mTxServ,\u0020nous\u0020accordons\u0020une\u0020grande\u0020importance\u0020dans\u0020la\u0020qualit\u00E9\u0020des\u0020outils\u0020que\u0020nous\u0020proposons,\u0020c\u0027est\u0020pourquoi\u0020nous\u0020avons\u0020d\u00E8s\u0020le\u0020d\u00E9part\u0020choisi\u0020de\u0020d\u00E9velopper\u0020notre\u0020propre\u0020panel\u0020de\u0020gestion.\u0020Ceci\u0020nous\u0020permet\u0020d\u0027am\u00E9liorer,\u0020jour\u0020apr\u00E8s\u0020jour,\u0020nos\u0020services,\u0020sans\u0020d\u00E9lai\u0020et\u0020sans\u0020contrainte."
                    }
                }, {
                    "@type": "Question",
                    "name": "Que\u0020se\u0020passe\u002Dt\u002Dil\u0020en\u0020cas\u0020d\u0027oubli\u0020ou\u0020d\u0027impossibilit\u00E9\u0020de\u0020renouvellement\u0020\u003F",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Vos\u0020donn\u00E9es\u0020sont\u0020importantes\u0020et\u0020nous\u0020le\u0020savons,\u0020nous\u0020mettons\u0020ainsi\u0020le\u0020paquet\u0020en\u0020faisant\u0020une\u0020sauvegarde\u0020compl\u00E8te\u0020des\u0020serveurs\u0020lors\u0020de\u0020leur\u0020expiration,\u0020cette\u0020sauvegarde\u0020est\u0020gard\u00E9e\u0020de\u0020c\u00F4t\u00E9\u0020pendant\u00201\u0020an\u0020pour\u0020vous\u0020permettre\u0020de\u0020r\u00E9ouvrir\u0020votre\u0020serveur\u0020avec\u0020vos\u0020donn\u00E9es.\u0020Simple,\u0020efficace."
                    }
                }
            ],
            en: [
                {
                    "@type": "Question",
                    "name": "What\u0020is\u0020the\u0020delivery\u0020delay\u0020\u003F",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "The\u0020delivery\u0020of\u0020your\u0020order\u0020comes\u0020as\u0020soon\u0020as\u0020the\u0020payment\u0020is\u0020validated\u0020by\u0020the\u0020financial\u0020organization.\u0020Once\u0020the\u0020payment\u0020has\u0020been\u0020validated,\u0020the\u0020delivery\u0020of\u0020a\u0020server\u0020usually\u0020takes\u0020place\u0020in\u0020the\u0020minute,\u0020regardless\u0020of\u0020the\u0020time\u0020of\u0020day\u0020or\u0020night\u0021"
                    }
                }, {
                    "@type": "Question",
                    "name": "What\u0020kind\u0020of\u0020hardware\u0020do\u0020you\u0020use\u0020\u003F",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "We\u2019re\u0020using\u0020last\u0020generation\u0020hardware\u0020for\u0020our\u0020game\u0020hosting\u0020servers.\u0020We\u2019re\u0020using\u0020MD\u0020Ryzen\u00203800X\u0020\u0040\u00204.5GHz\u0020processors,\u0020ECC\u00202666MHz\u0020DDR.4\u0020RAM,\u0020NVMe\u0020drives,\u0020and\u0020a\u0020low\u002Dlatency\u00201\u0020Gb\/s\u0020network\u0020protected\u0020by\u0020DDoS\u0020L7."
                    }
                }, {
                    "@type": "Question",
                    "name": "Where\u0020are\u0020located\u0020your\u0020servers\u003F",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Our\u0020game\u0020servers\u0020are\u0020located\u0020in\u0020many\u0020countries\u0020around\u0020the\u0020world.\u0020In\u0020Europe,\u0020our\u0020datacenters\u0020are\u0020located\u0020in\u0020France,\u0020United\u0020Kingdom,\u0020Germany\u0020and\u0020Poland.\u0020For\u0020North\u0020America,\u0020we\u0020have\u0020datacenters\u0020on\u0020the\u0020East\u0020and\u0020the\u0020West\u0020side,\u0020and\u0020also\u0020in\u0020Canada."
                    }
                }, {
                    "@type": "Question",
                    "name": "When\u0020my\u0020server\u0020is\u0020backup\u0020up\u003F",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Your\u0020game\u0020server\u0020is\u0020backup\u0020up\u0020every\u00206\u0020hours\u0020and\u0020at\u0020every\u0020shutdown.\u0020Those\u0020saves\u0020are\u0020kept\u0020for\u00201\u0020year\u0020after\u0020the\u0020expiration\u0020of\u0020the\u0020contract,\u0020so\u0020you\u0020can\u0020restore\u0020your\u0020datas\u0020in\u00201\u002Dclick\u0020anytime\u0020you\u0020want."
                    }
                }, {
                    "@type": "Question",
                    "name": "Is\u0020it\u0020possible\u0020to\u0020change\u0020offer\u003F",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "At\u0020mTxServ,\u0020we\u0020only\u0020use\u0020high\u002Dquality\u0020hardware\u0020and\u0020everything\u0020is\u0020designed\u0020for\u0020simplicity.\u0020You\u0020can\u0020change\u0020your\u0020offer\u0020with\u0020one\u0020click\u0020from\u0020the\u0020panel,\u0020with\u00201\u0020possible\u0020change\u0020for\u0020a\u0020time\u0020period\u0020of\u002015days.\u0020The\u0020remaining\u0020time\u0020will\u0020be\u0020converted\u0020on\u0020a\u0020pro\u0020rata\u0020basis\u0020into\u0020your\u0020new\u0020offer\u0020and\u0020this\u0020new\u0020offer\u0020will\u0020be\u0020active\u0020immediately,\u0020without\u0020any\u0020change\u0020into\u0020the\u0020ip\u0020adress\u0020nor\u0020data\u0020loss.\u0020\u0028Limit\u003A\u0020one\u0020offer\u0020change\u0020every\u002015\u0020days\u0020maximum\u0029"
                    }
                }, {
                    "@type": "Question",
                    "name": "What\u0020method\u0020of\u0020payment\u0020are\u0020available\u0020\u003F",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "You\u0020can\u0020pay\u0020directly\u0020with\u0020Credit\u0020Card,\u0020Paypal,\u0020and\u0020Tokens.\u0020Tokens\u0020\u0028virtual\u0020money\u0020specific\u0020to\u0020our\u0020website\u0029\u0020can\u0020be\u0020credited\u0020with\u0020Credit\u0020Card,\u0020Paypal,\u0020PaySafeCard\u0020and\u0020mobile\u0020call\/texts.\u0020Credit\u0020your\u0020tokens,\u0020share\u0020them\u0020with\u0020other\u0020members,\u0020and\u0020easily\u0020pay\u0020your\u0020services\u0021\u0020The\u0020payout\u0020rates\u0020of\u0020tokens\u0020may\u0020vary\u0020depending\u0020on\u0020the\u0020method\u0020of\u0020payment\u0020chosen.\u0020Please\u0020consult\u0020the\u0020corresponding\u0020pages\u0020for\u0020more\u0020information."
                    }
                }, {
                    "@type": "Question",
                    "name": "Why\u0020rent\u0020a\u0020mTxServ\u0020server\u0020instead\u0020of\u0020a\u0020dedicated\u0020server\u0020\/\u0020VPS\u0020\u003F",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Hosting\u0020a\u0020gameserver\u0020might\u0020look\u0020simple\u0020with\u0020few\u0020bits\u0020of\u0020knowledge,\u0020but\u0020maintaining\u0020quality\u0020hosting\u0020requires\u0020time\u0020and\u0020precision.\u0020With\u0020mTxServ,\u0020in\u0020just\u0020a\u0020few\u0020seconds\u0020you\u0020can\u0020have\u0020a\u0020gameserver\u0020hosted\u0020in\u0020high\u002Dquality\u0020hardware,\u0020a\u0020new\u0020generation\u0020web\u0020panel\u0020to\u0020simplify\u0020the\u0020management\u0020of\u0020the\u0020server,\u0020many\u0020redundant\u0020backups,\u0020free\u0020web\u0020hosting\u0020with\u0020a\u0020MySQL\u0020database\u0020for\u0020your\u0020addons\/plugins,\u0020and\u0020support\u0020dedicated\u0020to\u0020guiding\u0020you\u0020day\u0020by\u0020day.\u0020Choosing\u0020a\u0020GSP\u0020like\u0020mTxServ\u0020is\u0020getting\u0020the\u0020best\u0020of\u0020hosting,\u0020allowing\u0020you\u0020to\u0020concentrate\u0020on\u0020your\u0020preferred\u0020games\u0020as\u0020well\u0020as\u0020your\u0020community\u0021"
                    }
                }, {
                    "@type": "Question",
                    "name": "Who\u0020is\u0020behind\u0020mTxServ\u0020\u003F",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Created\u0020in\u00202009\u0020by\u0020passionate\u0020gamers\u0020who\u0020are\u0020still\u0020in\u0020charge,\u0020mTxServ\u0020has\u0020improved\u0020through\u0020the\u0020years\u0020to\u0020offer\u0020players\u0020the\u0020best\u0020experience\u0020possible\u0020on\u0020their\u0020preferred\u0020games.\u0020By\u0020becoming\u0020experts\u0020in\u0020hosting\u0020services\u0020for\u0020professional\u0020customers,\u0020we\u0020are\u0020able\u0020to\u0020offer\u0020quality\u0020services\u0020to\u0020everyone.\u0020Our\u0020servers\u0020are\u0020managed\u0020and\u0020optimized\u0020by\u0020hosting\u0020professionals,\u0020which\u0020is\u0020what\u0020makes\u0020our\u0020servers\u0020so\u0020reliable\u0020\u003B\u002D\u0029"
                    }
                }, {
                    "@type": "Question",
                    "name": "Which\u0020control\u0020panel\u0020do\u0020you\u0020use\u003F",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "At\u0020mTxServ,\u0020we\u0020attach\u0020great\u0020importance\u0020to\u0020the\u0020quality\u0020of\u0020the\u0020tools\u0020we\u0020offer,\u0020that\u2019s\u0020why\u0020we\u0020have\u0020chosen\u0020from\u0020the\u0020start\u0020to\u0020develop\u0020our\u0020own\u0020management\u0020panel.\u0020This\u0020allows\u0020us\u0020to\u0020improve\u0020our\u0020services\u0020day\u0020by\u0020day,\u0020without\u0020delay\u0020and\u0020without\u0020constraint."
                    }
                }, {
                    "@type": "Question",
                    "name": "What\u0020happens\u0020if\u0020you\u0020forget\u0020or\u0020can\u0027t\u0020renew\u0020your\u0020server\u003F",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Your\u0020data\u0020are\u0020important\u0020and\u0020we\u0020know\u0020it.\u0020We\u0020are\u0020doing\u0020our\u0020best\u0020to\u0020protect\u0020it\u0020by\u0020doing\u0020a\u0020full\u0020backup\u0020of\u0020servers\u0020when\u0020they\u0020expire,\u0020this\u0020backup\u0020is\u0020kept\u0020for\u0020an\u0020entire\u0020year\u0020to\u0020allow\u0020you\u0020to\u0020restore\u0020it\u0020on\u0020a\u0020new\u0020ordered\u0020server.\u0020Simple,\u0020reliable."
                    }
                }
            ]
        }

        const embed = new Discord.MessageEmbed()
            .setTitle('FAQ')
            .setDescription(`${userLang === 'fr' ? 'https://mtxserv.com/fr/faq' : 'https://mtxserv.com/faq'}`)
            .setColor('BLUE')
        ;

        for (const question of faq[userLang]) {
            embed.addField(question.name, question.acceptedAnswer.text)
        }

        return msg.say({
            embed
        })
    }
};
