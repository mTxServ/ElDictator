const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js')

module.exports = class WelcomeCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'welcome',
            group: 'admin',
            memberName: 'welcome',
            description: 'Send welcome message',
            ownerOnly: true,
            hidden: true,
            guarded: true,
            guildOnly: true
        });
    }

    async run(msg) {
        const iconFr = msg.guild.emojis.cache.find(emoji => emoji.name === 'fr');
        const iconEn = msg.guild.emojis.cache.find(emoji => emoji.name === 'en');

        const embed = new Discord.MessageEmbed()
            .setAuthor(`${this.client.user.tag}`, `${this.client.user.displayAvatarURL()}`)
            .setColor('ORANGE')
            .setDescription(`Bonjour :handshake:

**Bienvenue sur le discord d'entraide** de la communauté *mTxServ* 🧑‍ 🤝‍ :adult: 

**:mega: Avant tout, merci de consulter le <#767489801632219136>**

**Par où débuter ?**
Consultez la <#772773444252860436> et les channels \`lien-utiles\` de chaque jeu, ils contiennent de nombreux **guides et tutoriels**.

Vous pouvez rechercher un tutoriel avec \`m!howto\`, par exemple: \`m!howto "créer serveur darkrp"\` dans <#772812905514532885>.

**Commandes du bot**
Notre bot est en open-source sur [GitHub](https://github.com/mTxServ/ElDictator).

・Voir toutes les commandes: \`m!help\`
・\`m!login\` pour lier votre compte discord avec mTxServ
・\`m!rank\` pour voir votre profil
・\`:-adopt\` pour adopter votre animal <#773865026985525268>
・\`m!stock\` pour voir l'état des stocks

**Lien utiles**
・discord.js <#774950747225456660>
・VPS <#769550825004859425>
・Minecraft <#692076569665077249>
・Minecraft PE <#697474765690241095>
・GMod <#692102229137686616>
・ARK <#692079309640302682>
・Rust <#692079499851858050>
・Hytale <#769550444694732810>
・Valheim <#814556187369668619>

**Besoin d'aide avec votre serveur de jeu ?**
・Minecraft <#769567257289949184>
・Minecraft PE <#769566580018642995>
・GMod <#535090951841120257>
・ARK <#769567076301144094>
・Rust <#769566851579379752>
・Hytale <#769534249288073226>
・Onset <#655058043587002387>
・Arma 3 <#529615462783385612>
・CS:GO <#531059371086446592>
・Valheim <#808730842784202824>

**Besoin d'aide avec votre serveur VPS ?**
・VPS SSD & GAME <#769552131887202314>
・VPS GAME Windows <#769552096516898868>

**Publicités et recrutements**
・Présentez votre serveur à la communauté dans les channels **pub-serveurs**
・Youtubeur, Streameur? Publiez vos vidéos dans les channels **vidéos-streams**
・Publiez vos annonces de recrutement sur [GCA](https://g-ca.fr/compte/offres/nouveau)

**Communauté**
・<#563304015924953108>
・<#529992305885708323>
・<#773865026985525268>
・<#774231272033746944>
・<#563310350611775498>
・<#767487492571004960>`)
            .setFooter('Bienvenue sur mTxServ !');
        
       const langMsg = await msg.say({
            embed
        })

        langMsg.react('👌')
    }
};
