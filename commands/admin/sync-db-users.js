const mTxServCommand = require('../mTxServCommand.js');
const sqlite = require('sqlite')
    const path = require('path')

module.exports = class SyncDBUsersCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'sync-users',
            aliases: ['sync-users'],
            group: 'admin',
            memberName: 'sync-users',
            description: 'Sync sqlite users database with firebase',
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
            'auth_',
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

                    const userId = value.substring(type.length)
                    if (!userId) {
                        self.sayError(msg, `User not found for \`${value}\``)
                    } else {
                        const dbValues = self.client.provider.sqlite.get(null, value, null)
                        if (!dbValues.clientId || !dbValues.clientSecret || !dbValues.clientSecret) {
                            continue
                        }

                        await self.client.provider.rootRef
                            .child('users')
                            .child(userId)
                            .set(dbValues)
                    }
                }

                self.saySuccess(msg, 'SQLite **users** synchronized with **Firebase**.')
            })
            .catch(console.error)
    }
};