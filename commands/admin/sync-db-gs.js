const mTxServCommand = require('../mTxServCommand.js');
const sqlite = require('sqlite')
    const path = require('path')

module.exports = class SyncDBGameServersCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'sync-gs',
            aliases: ['sync-gs'],
            group: 'admin',
            memberName: 'sync-gs',
            description: 'Sync sqlite gameservers database with firebase',
            clientPermissions: ['SEND_MESSAGES'],
            ownerOnly: true,
            guildOnly: true,
            hidden: true,
            guarded: true
        });
    }

    async run(msg) {
        const self = this

        const types = [
            'g_gs_list_',
        ]

        sqlite.open(path.join(__dirname, '../../settings.sqlite3'))
            .then(async function (db) {
                const results = await db.all(`SELECT * FROM settings`);
                const data = JSON.parse(results[0]['settings'])

                const dataToTransfer = []

                for (const value of Object.keys(data)) {
                    let add = false

                    for (const type of types) {
                        if (value.substring(0, type.length) === type) {
                            add = true
                        }
                    }

                    if (add) {
                        dataToTransfer.push(value)
                    }
                }

                self.sayMessage(msg, `**SQLite (${dataToTransfer.length} items)**\n\n${dataToTransfer.map(value => `・ \`${value}\``).join('\n')}`.substr(0, 2048))

                for (const value of dataToTransfer) {
                    let type = ''

                    for (const _type of types) {
                        if (value.substring(0, _type.length) === _type) {
                            type = _type
                            break
                        }
                    }

                    const guildId = value.substring(type.length)
                    
                    if (!guildId) {
                        self.sayError(msg, `Guid not found for \`${value}\``)
                    } else {
                        await self.client.provider.set(
                            guildId,
                            'servers',
                            self.client.provider.sqlite.get(null, value, null)
                        )
                    }
                }

                self.saySuccess(msg, 'SQLite **game servers** synchronized with **Firebase**.')
            })
            .catch(console.error)
    }
};