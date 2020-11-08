const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js')

module.exports = class SelectLangCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'select-lang',
            group: 'admin',
            memberName: 'select-lang',
            description: 'Send select language message',
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
            .addField(`${iconFr} Bienvenue sur mTxServ!`, `Vous parlez Français? **Cliquez sur :flag_fr:** pour activer les sections françaises.`)
            .addField(`${iconEn} Welcome on mTxServ!`, `Do you speak English? **Click :flag_us:** to see english sections.`)
            .setFooter('Choose your language / Choisissez votre langue - mTxServ.com');

        const langMsg = await msg.say({
            embed
        })

        langMsg.react('🇫🇷')
        langMsg.react('🇺🇸')
    }
};