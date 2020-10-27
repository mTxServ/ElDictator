const mTxServCommand = require('../mTxServCommand.js');
const sqlite = require('sqlite')
    const path = require('path')

module.exports = class SyncDBCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'sync-db',
            aliases: ['sync-db'],
            group: 'admin',
            memberName: 'sync-db',
            description: 'Sync sqlite database with firebase',
            clientPermissions: ['SEND_MESSAGES'],
            ownerOnly: true,
            guildOnly: true,
            hidden: true,
            guarded: true
        });
    }

    async run(msg) {
        const self = this

        sqlite.open(path.join(__dirname, '../../settings.sqlite3'))
            .then(async function (db) {
                //const tables = await db.all(`SELECT name FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%';`);
                const results = await db.all(`SELECT * FROM settings`);
                const data = JSON.parse(results[0]['settings'])

                const ignored = [
                    'g_scores',
                    'feed_sub_%tag%',
                    'u_badges',
                    'guild_lang',
                    'g_lang',
                    'feed_articles',
                    'u_badges_'
                ]

                const dataToTransfer = []

                for (const value of Object.keys(data)) {
                    let add = true

                    for (const ignoredValue of ignored) {
                        if (value.substring(0, ignoredValue.length) === ignoredValue) {
                            add = false
                        }
                    }

                    if (add) {
                        dataToTransfer.push(value)
                    }
                }

                self.sayMessage(msg, `**SQLite**\n\n${dataToTransfer.map(value => `・ \`${value}\``).join('\n')}`)

                // self.saySuccess(msg, '**SQLite** synchronized with **Firebase**.')
            })
            .catch(console.error)
    }
};