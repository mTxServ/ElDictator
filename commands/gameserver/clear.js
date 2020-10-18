const mTxServCommand = require('../mTxServCommand.js')
const mTxServApi = require('../../api/mTxServApi')
const GameServerApi = require('../../api/GameServerApi')
const Discord = require('discord.js')

module.exports = class GameServerAddCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'clear-servers',
            aliases: ['server-clear', 'servers-clear'],
            group: 'gameserver',
            memberName: 'clear-server',
            description: 'Clear all game servers',
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
        this.client.guildSettings.clearGameServers(msg.guild.id,)
        return this.saySuccess(msg, 'Les serveurs de jeu ont été réinitialisés.')
    }
};