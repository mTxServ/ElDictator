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

**:mega: Avant tout, merci de consulter le #📜-règlement **

**Par où débuter ?**
Consultez la <#772773444252860436> et les channels \`lien-utiles\` de chaque jeu, ils contiennent de nombreux **guides et tutoriels**.
Vous vous également recherche un tutoriel avec \`m!howto\`, par exemple: \`m!howto "créer serveur darkrp"\` dans <#772812905514532885>.

**Commandes du bot**
Notre bot est en open-source sur [GitHub](https://github.com/mTxServ/ElDictator).

・Voir toutes les commandes: \`m!help\` ou <#769619263078006844>
・\`m!login\` pour lier votre discord avec celui de mTxServ
・\`m!rank\` pour voir votre profil et classement
・\`:-adopt\` pour activer votre animal de compagnie 🐷

**Lien utiles**
・discord.js <#774950747225456660>
・VPS <#769550825004859425>
・Minecraft <#692076569665077249>
・Minecraft PE <#697474765690241095>
・GMod <#692102229137686616>
・ARK <#692079309640302682>
・Rust <#692079499851858050>
・Hytale <#769550444694732810>

**Besoin d'aide avec votre serveur de jeu ?**
・Minecraft #⛏-aide-serveur 
・Minecraft PE #⚒-aide-serveur 
・GMod #🚔-aide-serveur 
・ARK #🦕-aide-serveur 
・Rust #🏹-aide-serveur 
・Hytale #💬-discussions 
・Onset #🚀-onset 
・Arma 3 #🚔-arma3 
・CS:GO #🔫-csgo 

**Besoin d'aide avec votre serveur VPS ?**
・VPS SSD #🐧-aide-linux 
・VPS GAME #🐧-aide-linux 
・VPS GAME Windows #🖥-aide-windows 

**Besoin d'aide avec votre serveur vocal ?**
・Teamspeak 3 #🎤-teamspeak 

**Publicités et recrutements**
・Présentez votre serveur à la communauté: <#769557502706319380>
・Youtubeur, Streameur? Publiez vos vidéos: <#773857435013087262>
・Publier vos annonces de recrutement: <#774985926006276107>
・Développeur d'addon GMod? Diffusez vos créations dans <#768150606501904415>

**Communauté**
・<#563304015924953108>
・<#773209448989982762>
・<#529992305885708323>
・<#773868338743869460>
・<#774966075111505941>
・<#774943644061794324>
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