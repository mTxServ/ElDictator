const mTxServCommand = require('../mTxServCommand.js')
const Discord = require('discord.js');

module.exports = class ShareImageCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'img',
            aliases: ['image'],
            group: 'image',
            memberName: 'img',
            description: 'Share an image',
            clientPermissions: ['SEND_MESSAGES'],
            args: [
                {
                    key: 'link',
                    prompt: 'Which image url do you want to share?',
                    type: 'string',
                    validate: url => {
                        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(url);
                    }
                },
            ],
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg, {link}) {
        if (msg.channel.type !== 'dm') {
            msg.delete();
        }

        const embed = new Discord.MessageEmbed()
            .setColor('BLUE')
            .setTimestamp()
            .setAuthor(msg.author.tag, msg.author.displayAvatarURL(), link)
            .setImage(link)
        ;

        const resMsg = await msg.say({
            embed
        })

        resMsg.react('👍');
        resMsg.react('👎');
        resMsg.react('🤷');
    }
};