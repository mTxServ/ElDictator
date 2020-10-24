const mTxServCommand = require('../mTxServCommand.js')
const Grabity = require("grabity");
const Discord = require('discord.js');
const URL = require('url').URL

module.exports = class ShareLinkCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'link',
            aliases: ['url'],
            group: 'util',
            memberName: 'link',
            description: 'Share a link',
            clientPermissions: ['SEND_MESSAGES'],
            args: [
                {
                    key: 'link',
                    prompt: 'Which url do you want to share?',
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

        try {
            const metadata = await Grabity.grabIt(link)
            if (!metadata.title) {
                return this.sayError(msg, 'Invalid URL (404?)')
            }

            const url = new URL(link)
            let icon = null
            const embed = new Discord.MessageEmbed()
                .setColor('BLUE')
                .setDescription(`${(metadata.content || metadata.description || '')}\n<${link}>`)
                .setTimestamp()
                .setFooter(`${url.hostname} - ${msg.author.tag}`)
            ;

            if (metadata.favicon) {
                if ('/' === metadata.favicon.substr(0, 1)) {
                    metadata.favicon = `${url.protocol}//${url.host}${metadata.favicon}`
                }

                const isValidUrl = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(metadata.favicon)
                if (isValidUrl) {
                    icon = metadata.favicon
                }
            }

            embed.setAuthor(metadata.title, icon, link)

            if (metadata.image) {
                if ('/' === metadata.image.substr(0, 1)) {
                    metadata.image = `${url.protocol}//${url.host}${metadata.image}`
                }

                const isValidUrl = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(metadata.image)
                if (isValidUrl) {
                    embed.setImage(metadata.image)
                }
            }

            await msg.say({
                embed
            }).then((resMsg) => {
                resMsg.react('👍');
                resMsg.react('👎');
                resMsg.react('🤷');
            })

        } catch (err) {
            return this.sayError(msg, 'Invalid URL (404?)')
        }
    }
};
