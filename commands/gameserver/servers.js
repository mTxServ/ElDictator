const mTxServCommand = require('../mTxServCommand.js')
const GameServerApi = require('../../api/GameServerApi')
const Discord = require('discord.js')
const paginationEmbed = require('discord.js-pagination');

module.exports = class GameServerListCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'servers',
            aliases: ['serveurs', 'serverlist'],
            group: 'gameserver',
            memberName: 'servers',
            description: 'Show game servers',
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

        let gameServers = this.client.guildSettings.gameServers(msg.guild.id)

        if (!gameServers.length) {
            const embed = new Discord.MessageEmbed()
                .setTitle(lang['servers']['no_result'])
                .setDescription(lang['servers']['no_result_more'])
                .setColor('ORANGE')
            ;

            return msg.say({
                embed
            });
        }

        const api = new GameServerApi()

        const pages = []
        for (const gameServer of gameServers) {
            const embed = await api.generateEmbed(msg, gameServer.game, gameServer.address, userLang);
            embed.setFooter(lang['servers']['how_to'])
            pages.push(embed)
        }

        if (pages.length === 1) {
            const embed = pages[0]
            return msg.say({
                embed
            })
        }

        paginationEmbed(msg, pages);
    }
};