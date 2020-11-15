const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js')
const path = require('path');
const fs = require('fs')

module.exports = class ImportEmojisCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'import-emojis',
            group: 'admin',
            memberName: 'import-emojis',
            description: 'Importe et synchronise les emojis du serveur discord où est executé la commande.',
            clientPermissions: ['SEND_MESSAGES', 'MANAGE_EMOJIS', 'USE_EXTERNAL_EMOJIS'],
            ownerOnly: true,
            hidden: true,
            guarded: true,
            guildOnly: true
        });
    }

    async run(msg) {
        const emojiDirectory = path.join(__dirname, '../../emojis')
        console.log(`List emojis in directory '${emojiDirectory}'`)

        fs.readdir(emojiDirectory, (err, files) => {
            if (err) return console.error(err);

            files.forEach((file) => {
                if (-1 === file.indexOf('.png')) {
                    return
                }

                const filePath = `${emojiDirectory}/${file}`
                const emojiName = file.replace('.png', '')
                const isAlreadyAdded = msg.guild.emojis.cache.some(emoji => emoji.name === emojiName)

                if (!isAlreadyAdded) {
                    console.log(`add emoji ${filePath}`)
                    msg.guild.emojis.create(filePath, emojiName)
                }
            });
        });

        const embed = new Discord.MessageEmbed()
            .setDescription(`Les emojis ont été importés et synchronisés.`)
            .setColor('GREEN')
        ;

        return msg.say(embed);
    }
};