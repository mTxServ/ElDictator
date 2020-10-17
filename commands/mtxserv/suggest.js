const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js');

module.exports = class SuggestCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'suggest',
            aliases: ['feedback'],
            group: 'mtxserv',
            memberName: 'suggest',
            description: 'Submit a feedback',
            clientPermissions: ['SEND_MESSAGES'],
            guarded: true,
            args: [{
                key: 'suggestion',
                prompt: 'What would you like to suggest?',
                type: 'string',
                validate: text => text.length >= 5,
            }],
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg, {suggestion}) {
        const userLang = this.resolveLangOfMessage(msg)
        const lang = require(`../../languages/${userLang}.json`)

        const channelId = userLang == 'fr' ? '726178171858190338' : '726178171858190338'

        const embed = new Discord.MessageEmbed()
            .setAuthor(`${msg.author.tag}`, `${msg.author.displayAvatarURL()}`)
            .setColor('DARK_BLUE')
            .setDescription(Discord.Util.removeMentions(suggestion.trim()))
            .setTimestamp();

        if (msg.channel.type !== 'dm') {
            embed
                .addField('Guild', `${msg.guild.name}`, true)
                .addField('Channel', `${msg.channel.name}`, true)
            ;
        }

        msg.delete()

        const resMsg = await this.client.channels.cache
            .get(channelId)
            .send({ embed })
        ;

        resMsg.react('👍');
        resMsg.react('👎');
        resMsg.react('🤷');

        return this.saySuccess(msg, lang['suggest']['confirm'].replace('%name%', `<@${msg.author.id}>`))
    }
};