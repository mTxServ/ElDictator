const mTxServCommand = require('../mTxServCommand.js')
const GameServerApi = require('../../api/GameServerApi')

module.exports = class GameServerStatusMinecraftCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'minecraft',
            aliases: ['mc', 'mc-status', 'mc-server'],
            examples: ['mc game-pl-02.MTXSERV.COM:27080', 'mc 51.75.51.29:27030'],
            group: 'gameserverstatus',
            memberName: 'minecraft',
            description: 'Check if a Minecraft game server is online or offline.',
            clientPermissions: ['SEND_MESSAGES'],
            args: [
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

    async run(msg, { address}) {
        const api = new GameServerApi()
        const embed = await api.generateEmbed(msg, 'minecraft', address, this.resolveLangOfMessage(msg))

        return msg.say({
            embed
        });
    }
};