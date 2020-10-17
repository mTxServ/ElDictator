const mTxServCommand = require('../mTxServCommand.js')
const GameServerApi = require('../../api/GameServerApi')
const Discord = require('discord.js')

module.exports = class AccountCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'servers',
            aliases: ['serveurs'],
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
        const userLang = this.resolveLangOfMessage(msg)
        const lang = require(`../../languages/${userLang}.json`)

        let gameServers = this.client.guildSettings.gameServers(msg.guild.id)

        gameServers = [{
            game: 'minecraft',
            host: 'GAME-PL-02.MTXSERV.COM',
            port: 27080,
            queryPort: 27080
        }]

        if (!gameServers.length) {
            const embed = new Discord.MessageEmbed()
                .setTitle('Aucun serveur de jeu configuré')
                .setDescription('__Pour ajouter votre serveur__, utilisez la commande `m!add-server`.\n__Vous devez avoir relié votre compte__ mTxServ avec `m!login`, pour vérifier utilisez `m!me`.')
                .setColor('ORANGE')
            ;

            return msg.say({
                embed
            });
        }

        const api = new GameServerApi()
        const resultsWithPlayers = [];
        const results = [];

        for (const gameServer of gameServers) {
            const status = await api.status(gameServer.game, gameServer.host, gameServer.port)
            if (!status.is_online) {
                continue;
            }

            const data = {
                gameServer: gameServer,
                status: status,
                players: parseInt(status.params.used_slots)
            }

            status.params.used_slots > 0 ? resultsWithPlayers.push(data) : results.push(data)
        }

        const selectedResult = resultsWithPlayers
            .concat(results)
            .slice(0, 10)
            .sort(function(a, b) {
                return a.players - b.players;
            })

        if (selectedResult.length === 1) {
            const gameServer = selectedResult[0].gameServer
            const embed = await api.generateEmbed(msg, gameServer.game, `${gameServer.host}:${gameServer.port}`, userLang)
            embed.setFooter('Pour ajouter votre serveur, m!add-server')
            return msg.say({
                embed
            })
        }


    }
};