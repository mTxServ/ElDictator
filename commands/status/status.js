const mTxServCommand = require('../mTxServCommand.js')
const GameServerApi = require('../../api/GameServerApi')

module.exports = class GameServerStatusCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'status',
            aliases: ['gs'],
            examples: ['status minecraft game-pl-02.MTXSERV.COM:27080', 'status gmod 51.75.51.29:27030'],
            group: 'gameserverstatus',
            memberName: 'gameserver',
            description: 'Check if a game server is online or offline.',
            clientPermissions: ['SEND_MESSAGES'],
            args: [
                {
                    key: 'game',
                    prompt: 'Game (minecraft/gmod/ark/rust/onset/arma3)?',
                    type: 'string',
                    oneOf: ['minecraft', 'gmod', 'ark', 'rust', 'onset', 'arma3'],
                },
                {
                    key: 'address',
                    prompt: 'Address of server (eg: game.fr.01.mtxserv.com:27030)?',
                    type: 'string',
                },
            ],
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg, { game, address}) {
        const api = new GameServerApi()
        const embed = await api.generateEmbed(msg, game, address, await this.resolveLangOfMessage(msg))

        return msg.say({
            embed
        });
    }
};