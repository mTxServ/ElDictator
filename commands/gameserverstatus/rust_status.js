const mTxServCommand = require('../mTxServCommand.js')
const GameServerApi = require('../../api/GameServerApi')

module.exports = class GameServerStatusRustCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'rust',
            aliases: ['rust-status', 'rust-server'],
            examples: ['rust game-pl-02.MTXSERV.COM:27080', 'rust 51.75.51.29:27030'],
            group: 'gameserverstatus',
            memberName: 'rust',
            description: 'Check if a Rust game server is online or offline.',
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

    async run(msg, { game, address}) {
        const api = new GameServerApi()
        const embed = await api.generateEmbed(msg, 'rust', address, this.getLangOfMember(msg.member))

        return msg.say({
            embed
        });
    }
};