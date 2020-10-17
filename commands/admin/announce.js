const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js')

module.exports = class BotStopCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'announce',
            aliases: ['announce'],
            group: 'admin',
            memberName: 'announce',
            description: 'Sends an announcement',
            clientPermissions: ['SEND_MESSAGES'],
            args: [
                {
                    key: 'locale',
                    prompt: 'Which language (fr/en)?',
                    type: 'string',
                    oneOf: ['fr', 'en'],
                },
                {
                    key: 'title',
                    prompt: 'Which title?',
                    type: 'string',
                    validate: text => text.length >= 3,
                },
                {
                    key: 'url',
                    prompt: 'Which url?',
                    type: 'string',
                    validate: url => {
                        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(url);
                    }
                },
                {
                    key: 'image',
                    prompt: 'Which image?',
                    type: 'string',
                    validate: url => {
                        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(url);
                    }
                },
                {
                    key: 'content',
                    prompt: 'Which content?',
                    type: 'string',
                    validate: text => text.length >= 3,
                },
            ],
            ownerOnly: true,
            hidden: true,
            guarded: true
        });
    }

    async run(msg, {locale, title, url, content, image}) {
        if (msg.channel.type !== 'dm') {
            return msg.say(`This command is only available is DM`)
        }

        const channelId = locale === 'fr' ? process.env.ANNOUNCE_CHANNEL_ID_FR : process.env.ANNOUNCE_CHANNEL_ID_EN
        const channel = await this.client.channels.cache.get(channelId)
        if (!channel) {
            return msg.say(`Channel ${channelId} not found`)
        }

        const embed = new Discord.MessageEmbed()
            .setAuthor(msg.client.user.tag, msg.client.user.displayAvatarURL(), url)
            .setTitle(title)
            .setColor('BLUE')
            .setDescription(content)
            .setImage(image)
        ;

        await msg.say({
            embed
        });

        return this.askConfirmation(msg, 'Did you validate the preview (yes/no) ?')
            .then(() => {
                msg.channel
                    .awaitMessages(m => m.author.id == msg.author.id,{max: 1, time: 30000})
                    .then(collected => {
                        // only accept messages by the user who sent the command
                        // accept only 1 message, and return the promise after 30000ms = 30s

                        // first (and, in this case, only) message of the collection
                        if (collected.first().content.toLowerCase() == 'yes') {
                            channel
                                .send({
                                    embed: embed
                                })
                                .then(this.saySuccess(msg, 'Announce sent'))
                        } else {
                            this.sayError(msg, 'Operation canceled.')
                        }
                    }).catch(() => {
                        this.sayError(msg, 'No answer after 30 seconds, operation canceled.')
                    });
            })
        ;
    }
};