const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js')
const backup = require('discord-backup')

module.exports = class LoadCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'backup-load',
            aliases: ['load-backup', 'load'],
            group: 'admin',
            memberName: 'backup-load',
            description: 'Load backup of a guild configuration',
            clientPermissions: ['SEND_MESSAGES'],
            args: [
                {
                    key: 'backupId',
                    prompt: 'Which backup ID do you want to restore?',
                    type: 'string',
                    validate: text => text.length >= 3,
                },
            ],
            ownerOnly: true,
            guildOnly: true,
            hidden: true,
            guarded: true
        });
    }

    async run(msg, {backupId}) {
        await this.sayWarning(msg, `Restoring current guild from the backup **#${backupId}**.`)

        backup.fetch(backupId).then(async () => {
            backup.load(backupId, msg.guild).then(() => {
                return this.saySuccess(msg, 'Backup successfull restored!')
            }).catch((err) => {
                return this.sayError(msg, ":x: Sorry, an error occurred... Please check that I have administrator permissions!");
            });
        }).catch((err) => {
            console.log(err);
            return this.sayError(msg, `:x: No backup found for #**${backupId}**!`);
        });
    }
};