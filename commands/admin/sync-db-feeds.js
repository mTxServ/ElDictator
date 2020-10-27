const mTxServCommand = require('../mTxServCommand.js');
const sqlite = require('sqlite')
    const path = require('path')

module.exports = class SyncDBFeedsCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'sync-feeds',
            aliases: ['sync-feeds'],
            group: 'admin',
            memberName: 'sync-feeds',
            description: 'Sync sqlite feeds database with firebase',
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
            'feed_sub_',
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

                    const game = value.substring(type.length)
                    if (!game || game === '%tag%') {
                        self.sayError(msg, `Game not found for \`${value}\``)
                    } else {
                        const dbValues = self.client.provider.sqlite.get(null, value, null)
                        for (const dbValue of dbValues) {
                            dbValue.locale = dbValue.locale || 'all'

                            if (!dbValue.locale || !dbValue.channelId || !dbValue.guildId) {
                                continue
                            }

                            await self.client.provider.rootRef
                                .child(dbValue.guildId)
                                .child('feeds_suscribed')
                                .child(game)
                                .child(dbValue.locale)
                                .set(dbValue.channelId)
                        }
                    }
                }

                self.saySuccess(msg, '**SQLite** synchronized with **Firebase**.')
            })
            .catch(console.error)
    }
};