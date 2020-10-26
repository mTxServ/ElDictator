const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js')

module.exports = class BotStopCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'stop',
            aliases: ['bot-stop'],
            group: 'admin',
            memberName: 'stop',
            description: 'Stop the discord bot.',
            clientPermissions: ['SEND_MESSAGES'],
            ownerOnly: true,
            hidden: true,
            guarded: true
        });
    }

    async run(msg) {
        const lang = require(`../../languages/${await this.resolveLangOfMessage(msg)}.json`);

        const embed = new Discord.MessageEmbed()
            .setAuthor(`${this.client.user.tag}`, `${this.client.user.displayAvatarURL()}`)
            .setColor('RED')
            .setTitle(':red_circle: Bot is offline')
            .setTimestamp();

        client
            .channels.cache.get(process.env.LOG_CHANNEL_ID)
            .send({
                embed: embed
            })

        return this
            .sayError(msg, lang['bot_stop']['confirm'])
            .then(process.exit)
    }
};