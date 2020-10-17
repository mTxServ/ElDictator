const mTxServCommand = require('../mTxServCommand.js')
const mTxServApi = require('../../api/mTxServApi')
const Discord = require('discord.js')

module.exports = class AccountCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'me',
            aliases: ['account'],
            group: 'mtxserv',
            memberName: 'me',
            description: 'Show my user profile',
            clientPermissions: ['SEND_MESSAGES'],
            guarded: true,
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg) {
        const lang = require(`../../languages/${this.resolveLangOfMessage(msg)}.json`)

        const api = new mTxServApi()

        const isAuthenticated = api.isAuthenticated(msg.author.id)
        if (!isAuthenticated) {
            return this.sayError(msg, lang['me']['not_logged'])
        }

        const embed = new Discord.MessageEmbed()
            .setColor('GREEN')
        ;

        let oauth

        try {
            oauth = await api.loginFromCredentials(msg.author.id)
        } catch(err) {
            console.error(err)
            return this.sayError(msg, lang['me']['cant_fetch'])
        }

        const me = await api.call(oauth['access_token'], 'user/me')
        const invoices = await api.call(oauth['access_token'], 'invoices')

        const countGameServers = invoices.filter(invoice => invoice.type_id === 1).length
        const countVoiceServers = invoices.filter(invoice => invoice.type_id === 2).length
        const countWebHosting = invoices.filter(invoice => invoice.type_id === 3).length
        const countVps = invoices.filter(invoice => invoice.type_id === 5).length

        embed.setDescription(lang['me']['logged'].replace('%name%', me.username))
        embed.setAuthor(`${msg.author.tag}`, `${msg.author.displayAvatarURL()}`)
        embed.addField('game servers'.toUpperCase(), countGameServers, true)
        embed.addField('voice servers'.toUpperCase(), countVoiceServers, true)
        embed.addField('web hosting'.toUpperCase(), countWebHosting, true)
        embed.addField('vps'.toUpperCase(), countVps, true)

        return msg.say({
            embed
        });
    }
};