const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js')

module.exports = class SelectGamesCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'select-games',
            group: 'admin',
            memberName: 'select-games',
            description: 'Send select games message',
            ownerOnly: true,
            hidden: true,
            guarded: true,
            guildOnly: true
        });
    }

    async run(msg) {
        const embed = new Discord.MessageEmbed()
            .setAuthor(`${this.client.user.tag}`, `${this.client.user.displayAvatarURL()}`)
            .setColor('ORANGE')
            .addField(`🇫🇷 Selectionnez vos jeux`, `Sélectionnez les jeux qui vous interessent **pour voir les channels dédiés**.`)
            .addField(`🇺🇸 Select your games`, `Select the games that interest you **to see related channels**.`)
            .addField('🎮 Games / Jeux', `・⛏ Minecraft (Java)
            ・⚒  Minecraft PE / Minecraft Bedrock
            ・🚔 Garry's Mod / GMod
            ・🦕 ARK
            ・🏹 Rust
            ・💎 Hytale
            ・🤖 Dev PHP / Discord.js
            ・🐧 VPS (Linux, Windows)
            ・➕ Onset, Arma3, CS:GO
            ・⚔ Valheim`)
            .setFooter('Choose your games / Choisissez vos jeux - mTxServ.com');

        const msg = await message.channel.messages.fetch('784686134575366205')
        
        if (msg !== null) {
            msg.edit(embed)   
        }
        else {
            msg.say({embed})   
        }
        
        /*const langMsg = await msg.say({
            embed
        })*/

    }
};
