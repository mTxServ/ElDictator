const mTxServCommand = require('../mTxServCommand.js')
const mTxServApi = require('../../api/mTxServApi')
const GameServerApi = require('../../api/GameServerApi')
const Discord = require('discord.js')

module.exports = class GameServerAddCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'add-server',
            aliases: ['server-add', 'serveur-add', 'add-serveur'],
            group: 'gameserver',
            memberName: 'add-server',
            description: 'Add a game servers',
            userPermissions: ['ADMINISTRATOR'],
            clientPermissions: ['SEND_MESSAGES'],
            guarded: true,
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg) {
        const userLang = await this.resolveLangOfMessage(msg)
        const lang = require(`../../languages/${userLang}.json`)

        const isAllowed = msg.member.hasPermission('ADMINISTRATOR')
        if (!isAllowed) {
            return this.sayError(msg, lang['server_add']['permissions'])
        }

        const api = new mTxServApi()
        const isAuthenticated = await api.isAuthenticated(msg.author.id)
        if (!isAuthenticated) {
            return this.sayError(msg, lang['server_add']['not_logged'])
        }

        let oauth

        try {
            oauth = await api.loginFromCredentials(msg.author.id)
        } catch(err) {
            console.error(err)
            return this.sayError(msg, lang['me']['cant_fetch'])
        }

        await this.sayWarning(msg, lang['server_add']['fetch'])

        const invoices = await api.call(oauth['access_token'], 'invoices')

        if (!invoices.length) {
            return this.sayError(msg, lang['server_add']['no_result'])
        }

        const gsApi = new GameServerApi()

        let embed = new Discord.MessageEmbed()
            .setColor('BLUE')
            .setTimestamp()

        const list = []

        for (const invoice of invoices) {
            if (invoice.type_id !== 1) {
                continue;
            }

            const status = await gsApi.status(invoice.game, invoice.host, invoice.port)
            list.push({
                invoice: invoice,
                status: status
            })
        }

        embed.setDescription(list.map((item, key) => `**${++key}.** ❯ __${item.status.params.used_slots||0}/${item.status.params.max_slots||0}__ ❯ **${item.invoice.address.toUpperCase()}**\n\`\`\`fix\n${item.status.params.host_name||item.invoice.cache_hostname||item.invoice.name||'n-a'}\`\`\``))

        await msg.say({
            embed
        })

        let serverKey = await this.getInput(msg, lang['server_add']['which'], true);
        serverKey--

        if (typeof invoices[serverKey] === 'undefined') {
            return this.sayError(msg, lang['server_add']['not_found'])
        }

        this.saySuccess(msg, lang['server_add']['added'])

        let gameServers = await this.client.provider.get(msg.guild.id, 'servers', [])
        /*gameServers = gameServers.filter(gs => gs.address !== invoices[serverKey].address)
        
        gameServers.push({
            game: invoices[serverKey].game,
            address: invoices[serverKey].address,
            isHostedOnMtxServ: true,
            creatorId: msg.author.id
        })*/
        
        gameServers = gameServers.filter(gs => gs.address !== list[serverKey].invoice.address)
        
        gameServers.push({
            game: list[serverKey].invoice.game,
            address: list[serverKey].invoice.address,
            isHostedOnMtxServ: true,
            creatorId: msg.author.id
        })
        
//         this.client
//             .channels
//             .cache
//             .get(process.env.LOG_CHANNEL_ID)
//             .send(serverKey)
//         ;

        await this.client.provider.set(msg.guild.id, 'servers', gameServers)

        //embed = await gsApi.generateEmbed(msg, invoices[serverKey].game, invoices[serverKey].address, userLang)
        embed = await gsApi.generateEmbed(msg, list[serverKey].invoice.game, list[serverKey].invoice.address, userLang)
        return msg.say({
            embed
        })
    }
};
